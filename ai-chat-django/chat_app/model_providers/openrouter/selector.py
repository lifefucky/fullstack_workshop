from .api import fetch_models, is_model_free
from ..image_models import list_image_models

CODE_HINTS = ("coder", "-code", "code-", "/code", " code")


def _outputs_text_only(model: dict) -> bool:
    outputs = (model.get("architecture") or {}).get("output_modalities") or ["text"]
    return outputs == ["text"]


def _is_code_model(model: dict) -> bool:
    label = f"{model.get('id', '')} {model.get('name') or ''}".lower()
    return any(hint in label for hint in CODE_HINTS)


def _entry(model: dict) -> dict:
    model_id = model["id"]
    return {
        "brand": model_id.split("/")[0],
        "model_id": model_id,
        "name": model.get("name") or model_id.split("/")[-1],
    }


def get_top_models() -> dict:
    """Бесплатные текстовые модели. Код — только модели с code в имени, не музыка и не картинки."""
    models = fetch_models()
    chat_models = [
        model
        for model in models
        if is_model_free(model)
        and _outputs_text_only(model)
        and "content-safety" not in model["id"]
        and not model["id"].startswith("openrouter/")
    ]

    code_models = [_entry(model) for model in chat_models if _is_code_model(model)]

    seen_brands = set()
    text_models = []
    for model in chat_models:
        if _is_code_model(model):
            continue
        brand = model["id"].split("/")[0].lower()
        if brand in seen_brands:
            continue
        seen_brands.add(brand)
        text_models.append(_entry(model))
        if len(text_models) == 10:
            break

    return {
        "code_models": code_models,
        "text_models": text_models,
        "image_models": list_image_models(),
    }
