from unittest.mock import patch

from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from chat_app.models import Answer, Category, Question

User = get_user_model()

MODELS_PAYLOAD = {
    "code_models": [{"brand": "model", "model_id": "model/model-code"}],
    "text_models": [{"brand": "model", "model_id": "model/model-xxx"}],
}

PROMPT_EN_CAPITAL = "The capital of Poland?"
PROMPT_TEXT = "Объясни теорию относительности простыми словами"
PROMPT_CODE = "Реализуй сортировку пузырьком на Python"
PROMPT_IMAGE = "Космический корабль в стиле киберпанк"


class ChatRestFlowTests(APITestCase):
    """Сценарии REST-чата: auth, категории, вопросы и ответы."""

    password = "Test12345!"

    def setUp(self):
        self.user = User.objects.create_user(
            email="chat.tester@example.com",
            password=self.password,
            username="chat-tester",
            name="Chat Tester",
            is_active=True,
        )
        EmailAddress.objects.create(
            user=self.user,
            email=self.user.email,
            verified=True,
            primary=True,
        )
        self.keeper = User.objects.create_user(
            email="chat.keeper@example.com",
            password=self.password,
            username="chat-keeper",
            name="Keeper",
        )
        Category.objects.create(name="Чужая категория", owner=self.keeper)

    # --- Вспомогательные методы ---

    def authenticate(self) -> str:
        """Логин через кастомный JWT-эндпоинт и установка Authorization."""
        login = self.client.post(
            reverse("token_obtain_pair"),
            {"email": self.user.email, "password": self.password},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        token = login.data["access"]
        self.assertTrue(token)
        self.assertEqual(login.data["user"]["email"], self.user.email)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        return token

    def create_category(self, name: str = "Тестовая категория"):
        return self.client.post(
            reverse("category-list"),
            {"name": name},
            format="json",
        )

    def create_question(
        self,
        category_id,
        prompt: str,
        model_type: str,
        model: str,
        language: str = "ru",
    ):
        return self.client.post(
            reverse("question-list", kwargs={"category_pk": str(category_id)}),
            {
                "prompt": prompt,
                "model_type": model_type,
                "model": model,
                "category_id": str(category_id),
                "language": language,
            },
            format="json",
        )

    # --- Тесты ---

    def test_get_models_and_test_query_without_auth(self):
        """Публичные эндпоинты /models/ и /test-query/ работают без токена."""
        with patch("chat_app.views.get_top_models", return_value=MODELS_PAYLOAD):
            models = self.client.get(reverse("models_overview"))

        self.assertEqual(models.status_code, status.HTTP_200_OK)
        self.assertIn("text_models", models.data)
        self.assertIn("code_models", models.data)
        model_id = models.data["text_models"][0]["model_id"]
        self.assertEqual(model_id, "model/model-xxx")

        with patch(
            "chat_app.views.query_openrouter",
            return_value=("Warsaw", model_id),
        ) as query:
            test_query = self.client.post(
                reverse("test_query"),
                {
                    "prompt": PROMPT_EN_CAPITAL,
                    "model_id": model_id,
                    "language": "en",
                },
                format="json",
            )

        self.assertEqual(test_query.status_code, status.HTTP_200_OK)
        self.assertEqual(test_query.data[0], "Warsaw")
        self.assertEqual(test_query.data[1], model_id)
        query.assert_called_once_with(
            prompt=PROMPT_EN_CAPITAL,
            model_id=model_id,
            language="en",
        )

    def test_chat_rest_flow(self):
        """Повторяет шаги из requests/chat.rest поверх вспомогательных методов."""
        self.authenticate()

        category = self.create_category()
        self.assertEqual(category.status_code, status.HTTP_201_CREATED)
        category_id = str(category.data["id"])
        self.assertEqual(category.data["name"], "Тестовая категория")
        self.assertEqual(category.data["owner"], self.user.id)

        listed = self.client.get(reverse("category-list"))
        self.assertEqual(listed.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["name"] for item in listed.data],
            ["Тестовая категория"],
        )

        with patch("chat_app.views.get_top_models", return_value=MODELS_PAYLOAD):
            models = self.client.get(reverse("models_overview"))
        self.assertEqual(models.status_code, status.HTTP_200_OK)
        model_id = models.data["text_models"][0]["model_id"]

        with patch(
            "chat_app.views.query_openrouter",
            return_value=("Warsaw", model_id),
        ):
            test_query = self.client.post(
                reverse("test_query"),
                {
                    "prompt": PROMPT_EN_CAPITAL,
                    "model_id": model_id,
                    "language": "en",
                },
                format="json",
            )
        self.assertEqual(test_query.status_code, status.HTTP_200_OK)

        with patch(
            "chat_app.serializers.query_provider",
            return_value=("Простое объяснение.", 12, model_id),
        ):
            text_question = self.create_question(
                category_id=category_id,
                prompt=PROMPT_TEXT,
                model_type="text",
                model=model_id,
                language="ru",
            )
        self.assertEqual(text_question.status_code, status.HTTP_201_CREATED)
        text_question_id = str(text_question.data["id"])

        code_body = "def bubble_sort(items):\n    return sorted(items)\n"
        with patch(
            "chat_app.serializers.query_provider",
            return_value=(code_body, 20, model_id),
        ):
            code_question = self.create_question(
                category_id=category_id,
                prompt=PROMPT_CODE,
                model_type="code",
                model=model_id,
                language="ru",
            )
        self.assertEqual(code_question.status_code, status.HTTP_201_CREATED)

        image_url = "http://localhost:8000/media/generated/ship.png"
        with patch(
            "chat_app.serializers.query_flux_image",
            return_value=(image_url, None),
        ):
            image_question = self.create_question(
                category_id=category_id,
                prompt=PROMPT_IMAGE,
                model_type="image",
                model="flux",
                language="ru",
            )
        self.assertEqual(image_question.status_code, status.HTTP_201_CREATED)

        self.user.refresh_from_db()
        self.keeper.refresh_from_db()
        self.assertEqual(self.user.quantity, 3)
        self.assertEqual(self.keeper.quantity, 0)
        self.assertEqual(Question.objects.filter(user=self.user).count(), 3)
        self.assertEqual(Question.objects.filter(user=self.keeper).count(), 0)
        self.assertEqual(Answer.objects.count(), 3)
        self.assertEqual(Category.objects.filter(owner=self.keeper).count(), 1)

        # Ответы по вопросу доступны без токена
        self.client.credentials()
        answers = self.client.get(
            reverse("answer-list", kwargs={"question_pk": text_question_id}),
            HTTP_ACCEPT="application/json",
        )
        self.assertEqual(answers.status_code, status.HTTP_200_OK)
        self.assertEqual(len(answers.data), 1)
        self.assertEqual(answers.data[0]["content"], "Простое объяснение.")
        self.assertEqual(str(answers.data[0]["question"]), text_question_id)
        self.assertEqual(answers.data[0]["model"], model_id)

    def test_category_and_questions_require_access_token(self):
        """Категории и вопросы недоступны без JWT-токена."""
        category = self.client.post(
            reverse("category-list"),
            {"name": "Тестовая категория"},
            format="json",
        )
        self.assertEqual(category.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(Category.objects.filter(owner=self.user).exists())

        own = Category.objects.create(name="Тестовая категория", owner=self.user)
        question = self.client.post(
            reverse("question-list", kwargs={"category_pk": own.id}),
            {
                "prompt": PROMPT_TEXT,
                "model_type": "text",
                "model": "model/model-xxx",
                "category_id": str(own.id),
                "language": "ru",
            },
            format="json",
        )
        self.assertEqual(question.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(Question.objects.filter(user=self.user).exists())
        self.user.refresh_from_db()
        self.assertEqual(self.user.quantity, 0)
