from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class TokenFlowTests(APITestCase):
    """Логин, обновление access по refresh и проверка токена."""

    password = "Test12345!"

    def setUp(self):
        self.user = User.objects.create_user(
            email="tester@example.com",
            password=self.password,
            username="tester",
            name="Tester",
            is_active=True,
        )
        EmailAddress.objects.create(
            user=self.user,
            email=self.user.email,
            verified=True,
            primary=True,
        )

    def test_login_refresh_and_verify(self):
        login = self.client.post(
            "/api/auth/custom/login/",
            {"email": self.user.email, "password": self.password},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        access = login.data["access"]
        refresh = login.data["refresh"]
        self.assertEqual(login.data["user"]["email"], self.user.email)
        self.assertEqual(login.data["user"]["id"], self.user.id)

        refreshed = self.client.post(
            "/api/auth/refresh/",
            {"refresh": refresh},
            format="json",
        )
        self.assertEqual(refreshed.status_code, status.HTTP_200_OK)
        new_access = refreshed.data["accessToken"]
        self.assertTrue(new_access)
        self.assertNotEqual(new_access, access)
        self.assertEqual(refreshed.data["refreshToken"], refresh)

        for token in (access, refresh, new_access):
            verified = self.client.post(
                "/api/auth/token/verify/",
                {"token": token},
                format="json",
            )
            self.assertEqual(verified.status_code, status.HTTP_200_OK)

        invalid = self.client.post(
            "/api/auth/token/verify/",
            {"token": "not-a-token"},
            format="json",
        )
        self.assertEqual(invalid.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(invalid.data["detail"], "Token is invalid or expired")

    def test_refresh_requires_token(self):
        response = self.client.post("/api/auth/refresh/", {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Refresh token is required.")


class DeleteUserTests(APITestCase):
    """Удаление по email или id. Трогаем только отдельный тестовый аккаунт."""

    URL = reverse("delete_user_by_email_or_id")

    def setUp(self):
        self.user = User.objects.create_user(
            email="delete.me@example.com",
            password="Test12345!",
            username="delete-me",
            name="Delete Me",
        )
        self.keeper = User.objects.create_user(
            email="keeper@example.com",
            password="Test12345!",
            username="keeper",
            name="Keeper",
        )

    def test_delete_by_email(self):
        response = self.client.delete(
            self.URL,
            {"email": self.user.email},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())
        self.assertTrue(User.objects.filter(pk=self.keeper.pk).exists())

    def test_delete_by_id(self):
        response = self.client.delete(
            self.URL,
            {"id": self.user.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())
        self.assertTrue(User.objects.filter(pk=self.keeper.pk).exists())

    def test_delete_requires_identifier(self):
        response = self.client.delete(self.URL, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())

    def test_delete_unknown_user(self):
        response = self.client.delete(
            self.URL,
            {"email": "nobody@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())


class UserDataTests(APITestCase):
    """Данные, имя и quantity. Меняем только тестовую учётку в тестовой базе."""

    password = "Test12345!"

    def setUp(self):
        self.user = User.objects.create_user(
            email="profile.tester@example.com",
            password=self.password,
            username="profile-tester",
            name="Before",
            quantity=1,
            is_active=True,
        )
        EmailAddress.objects.create(
            user=self.user,
            email=self.user.email,
            verified=True,
            primary=True,
        )
        self.other = User.objects.create_user(
            email="profile.keeper@example.com",
            password=self.password,
            username="profile-keeper",
            name="Keeper",
            quantity=9,
        )

    def authenticate(self):
        login = self.client.post(
            reverse("token_obtain_pair"),
            {"email": self.user.email, "password": self.password},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login.data['access']}",
        )

    def test_get_user_data(self):
        self.authenticate()
        response = self.client.get(reverse("get-user-data"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["name"], "Before")
        self.assertEqual(response.data["quantity"], 1)
        self.assertIn("provider", response.data)

    def test_update_name(self):
        self.authenticate()
        response = self.client.put(
            reverse("update-name"),
            {"name": "Tester"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Tester")
        self.assertEqual(response.data["email"], self.user.email)

        self.user.refresh_from_db()
        self.other.refresh_from_db()
        self.assertEqual(self.user.name, "Tester")
        self.assertEqual(self.user.quantity, 1)
        self.assertEqual(self.other.name, "Keeper")
        self.assertEqual(self.other.quantity, 9)

    def test_update_quantity(self):
        self.authenticate()
        response = self.client.put(
            reverse("update-quantity"),
            {"quantity": 5},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["quantity"], 5)
        self.assertEqual(response.data["name"], "Before")

        self.user.refresh_from_db()
        self.other.refresh_from_db()
        self.assertEqual(self.user.quantity, 5)
        self.assertEqual(self.user.name, "Before")
        self.assertEqual(self.other.quantity, 9)
        self.assertEqual(self.other.name, "Keeper")

    def test_get_user_data_requires_access_token(self):
        response = self.client.get(reverse("get-user-data"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, "Before")
        self.assertEqual(self.user.quantity, 1)

    def test_update_name_requires_access_token(self):
        response = self.client.put(
            reverse("update-name"),
            {"name": "Tester"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, "Before")
        self.assertEqual(self.user.quantity, 1)

    def test_update_quantity_requires_access_token(self):
        response = self.client.put(
            reverse("update-quantity"),
            {"quantity": 5},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, "Before")
        self.assertEqual(self.user.quantity, 1)

    def test_invalid_access_token(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer not-a-token")
        response = self.client.get(reverse("get-user-data"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_name_requires_name(self):
        self.authenticate()
        response = self.client.put(reverse("update-name"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, "Before")

    def test_update_quantity_requires_integer(self):
        self.authenticate()
        response = self.client.put(
            reverse("update-quantity"),
            {"quantity": "five"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)
        self.user.refresh_from_db()
        self.assertEqual(self.user.quantity, 1)
