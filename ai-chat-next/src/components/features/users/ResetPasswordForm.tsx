// src/components/features/users/ResetPasswordForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { localizationService } from "@/services/localizationService";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordForm({ uid, token }: { uid: string; token: string }) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password1 !== password2) {
      setError(localizationService.get("passwordsNotMatch"));
      return;
    }

    try {
      await axios.post(`${baseURL}/api/auth/password/reset/confirm/`, {
        uid,
        token,
        new_password1: password1,
        new_password2: password2,
      });
      setSuccess(true);
      setTimeout(() => router.push("/"), 3000);
    } catch {
      setError(localizationService.get("ResetError"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-card">
        <h2 className="mb-6 text-center text-2xl font-semibold text-ink">
          {localizationService.get("ResetPasswordTitle")}
        </h2>
        {success ? (
          <p className="text-center text-ink">{localizationService.get("ResetSuccess")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mute">
                {localizationService.get("NewPassword")}
              </label>
              <input
                type="password"
                value={password1}
                onChange={e => setPassword1(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mute">
                {localizationService.get("confirmPassword")}
              </label>
              <input
                type="password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-accent"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              {localizationService.get("ResetPasswordAction")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
