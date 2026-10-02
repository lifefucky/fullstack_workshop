// src/components/features/users/BaseForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useDispatch } from "react-redux";
import { showNotification } from "@/reducers/notificationReducer";
import { AppDispatch } from "@/store/store";
import { localizationService } from "@/services/localizationService";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

type BaseFormProps = {
  type: "login" | "register";
  onClose: () => void;
};

const BaseForm: React.FC<BaseFormProps> = ({ type, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (resetMode) {
      try {
        await axios.post(`${baseURL}/api/auth/password/reset/`, { email });
        dispatch(showNotification(localizationService.get("resetLinkSent"), "success", 5));
        setResetMode(false);
      } catch {
        setError(localizationService.get("resetLinkError"));
      }
      return;
    }

    if (type === "register" && password !== confirmPassword) {
      setError(localizationService.get("passwordsNotMatch"));
      return;
    }

    try {
      if (type === "register") {
        await axios.post(`${baseURL}/api/auth/registration/`, {
          email,
          name,
          password1: password,
          password2: confirmPassword,
        });
        dispatch(showNotification(localizationService.get("registrationSuccess"), "success", 5));
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError(localizationService.get("invalidCredentials"));
          return;
        }
      }
      onClose();
    } catch {
      setError(localizationService.get(type === "register" ? "registrationError" : "loginError"));
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-ink">
        {resetMode
          ? localizationService.get("resetPassword")
          : type === "register"
          ? localizationService.get("registration")
          : localizationService.get("login")}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-mute">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-accent"
            placeholder="your@email.com"
          />
        </div>

        {!resetMode && (
          <>
            <div>
              <label className="block text-sm font-medium text-mute">
                {localizationService.get("password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-accent"
                placeholder="••••••••"
              />
            </div>

            {type === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-mute">
                    {localizationService.get("confirmPassword")}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-accent"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-mute">
                    {localizationService.get("name")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-accent"
                    placeholder={localizationService.get("yourName")}
                  />
                </div>
              </>
            )}
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="rounded-xl bg-accent px-4 py-2 text-white hover:bg-blue-600"
        >
          {resetMode
            ? localizationService.get("sendResetLink")
            : type === "register"
            ? localizationService.get("register")
            : localizationService.get("signIn")}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {!resetMode && (
          <button onClick={() => setResetMode(true)} className="text-accent hover:underline">
            {localizationService.get("forgotPassword")}
          </button>
        )}

        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          {localizationService.get("signInWithGoogle")}
        </button>

        <button onClick={onClose} className="text-mute hover:underline">
          {localizationService.get("close")}
        </button>
      </div>
    </div>
  );
};

export default BaseForm;
