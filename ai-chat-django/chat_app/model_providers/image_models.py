from typing import Tuple
import requests
from decouple import config
import base64
import uuid
import time
from django.conf import settings
from django.core.files.base import ContentFile
from imagekitio import ImageKit
from ..models import GeneratedImage


TOGETHER_API_KEY = config("TOGETHER_API_KEY")
TOGETHER_API_URL = config("TOGETHER_API_URL").rstrip("/")

# Глобальная переменная для отслеживания времени последнего запроса
LAST_REQUEST_TIME = 0


def _image_extension(content: bytes, content_type: str = "") -> str:
    content_type = (content_type or "").lower()
    if "jpeg" in content_type or "jpg" in content_type or content.startswith(b"\xff\xd8"):
        return "jpg"
    if "webp" in content_type or content.startswith(b"RIFF"):
        return "webp"
    if "gif" in content_type or content.startswith(b"GIF8"):
        return "gif"
    return "png"


def _api_error_message(response: requests.Response) -> str:
    try:
        body = response.json()
    except ValueError:
        return ""
    error = body.get("error") if isinstance(body, dict) else None
    if isinstance(error, dict):
        return str(error.get("message") or "")
    if isinstance(error, str):
        return error
    return ""


def _store_generated_image(
    content: bytes,
    extension: str,
    prompt: str,
    source_url: str | None,
) -> str:
    """Кладёт байты в ImageKit. Без ключа остаётся локальный media-файл."""
    private_key = config("IMAGE_KIT_PRIVATE_KEY", default="")
    if private_key:
        uploaded = ImageKit(private_key=private_key).files.upload(
            file=content,
            file_name=f"{uuid.uuid4()}.{extension}",
            folder="generated",
        )
        img = GeneratedImage(prompt=prompt, source_url=source_url, url=uploaded.url)
        img.save()
        return uploaded.url

    img = GeneratedImage(prompt=prompt, source_url=source_url)
    img.file.save(
        f"{uuid.uuid4()}.{extension}",
        ContentFile(content),
        save=True,
    )
    return f"http://{settings.DOMAIN}{img.file.url}"


def list_image_models() -> list[dict]:
    """Актуальный каталог картинок с Pollinations, без community-дублей."""
    try:
        response = requests.get(
            f"{TOGETHER_API_URL}/image/models",
            headers={"Authorization": f"Bearer {TOGETHER_API_KEY}"},
            timeout=15,
        )
        response.raise_for_status()
        payload = response.json()
    except (requests.RequestException, ValueError) as exc:
        print(f"Не удалось загрузить список image-моделей: {exc}")
        return []

    items = payload if isinstance(payload, list) else payload.get("data", [])
    models = []
    for item in items:
        if item.get("community"):
            continue
        outputs = item.get("output_modalities") or []
        if outputs and "image" not in outputs:
            continue
        model_id = item.get("name")
        if not model_id:
            continue
        models.append(
            {
                "brand": model_id.split("/")[0],
                "model_id": model_id,
                "name": item.get("title") or model_id,
            }
        )
    return models


def query_flux_image(prompt: str, model: str = "flux") -> Tuple[str, None]:
    """Генерация изображений через Pollinations (gen.pollinations.ai) с обработкой лимитов"""
    global LAST_REQUEST_TIME

    try:
        # Пауза между запросами: у flux на Pollinations лимит 60 rpm, держим прежний запас
        current_time = time.time()
        if current_time - LAST_REQUEST_TIME < 10:
            wait_time = 10 - (current_time - LAST_REQUEST_TIME)
            print(f"Waiting {wait_time:.1f} seconds to comply with rate limits...")
            time.sleep(wait_time)

        headers = {
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": model or "flux",
            "prompt": prompt,
            "size": "512x512",
            "n": 1,
            "response_format": "url",
        }

        response = requests.post(
            f"{TOGETHER_API_URL}/v1/images/generations",
            headers=headers,
            json=payload,
            timeout=90,
        )

        LAST_REQUEST_TIME = time.time()  # Обновляем время последнего запроса

        print("API response:", response.status_code, response.text)

        # Обработка успешного ответа
        if response.status_code == 200:
            data = response.json()
            if "data" in data and len(data["data"]) > 0:
                image_data = data["data"][0]

                if "url" in image_data:
                    img_response = requests.get(image_data["url"], timeout=90)
                    img_response.raise_for_status()

                    media_type = image_data.get("media_type") or img_response.headers.get(
                        "Content-Type", ""
                    )
                    stored_url = _store_generated_image(
                        img_response.content,
                        _image_extension(img_response.content, media_type),
                        prompt,
                        image_data["url"],
                    )
                    return stored_url, None

                elif "b64_json" in image_data:
                    raw = base64.b64decode(image_data["b64_json"])
                    media_type = image_data.get("media_type", "")
                    stored_url = _store_generated_image(
                        raw,
                        _image_extension(raw, media_type),
                        prompt,
                        None,
                    )
                    return stored_url, None

        # Обработка ошибки 429
        elif response.status_code == 429:
            retry_after = int(response.headers.get("retry-after", 10))
            print(f"Rate limit exceeded. Waiting {retry_after} seconds...")
            time.sleep(retry_after)
            return query_flux_image(prompt, model)

        message = _api_error_message(response)
        if message:
            return f"[Image Error] {message}", None

        return "[Image Error] No valid image data in response", None

    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        return f"[Image Error] Request failed: {str(e)}", None
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return f"[Image Error] {str(e)}", None
