// src/components/features/users/UserProfileClient.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { AppDispatch } from "@store/store";
import apiClient from "@services/authClientService";
import Notification from "@features/common/Notification";
import { localizationService } from "@services/localizationService";
import { showNotification } from "@reducers/notificationReducer";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UserProfileClient() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiClient.get(`${baseURL}/api/auth/get-user-data/`);
        setUserData(res.data);
        setName(res.data.name || "");
      } catch (err) {
        dispatch(showNotification(localizationService.get("ErrorFetchingProfile"), "error", 4));
        if (axios.isCancel(err) || (axios.isAxiosError(err) && err.response?.status === 401)) {
          await signOut({ callbackUrl: "/" });
        }
      }
    };

    fetchUserData();
  }, [router, dispatch]);

  const updateName = async () => {
    if (!name.trim()) return;

    try {
      setSaving(true);
      const res = await apiClient.put(`${baseURL}/api/auth/update-name/`, { name });
      setUserData(prev => (prev ? { ...prev, name: res.data.name } : null));
      setEditingName(false);
    } catch (err) {
      console.error("Error updating name", err);
      if (axios.isCancel(err) || (axios.isAxiosError(err) && err.response?.status === 401)) {
        await signOut({ callbackUrl: "/" });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-mute">
        {localizationService.get("LoadingProfile")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas p-4 md:p-6">
      <Notification />
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm text-ink hover:bg-surface"
        >
          {localizationService.get("ToHome")}
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
          {localizationService.get("YourProfile")}
        </h1>

        <div className="mt-6 space-y-5 rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-mute">Email</p>
            <p className="mt-1 text-ink">{userData.email}</p>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-mute">{localizationService.get("Name")}</p>
              {editingName ? (
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={updateName}
                  onKeyDown={e => {
                    if (e.key === "Enter") updateName();
                    if (e.key === "Escape") {
                      setName(userData.name);
                      setEditingName(false);
                    }
                  }}
                  disabled={saving}
                  className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none focus:border-accent"
                  autoFocus
                />
              ) : (
                <p className="mt-1 text-ink">
                  {userData.name || localizationService.get("NotSpecified")}
                </p>
              )}
            </div>
            {!editingName && (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="shrink-0 rounded-full border border-line px-3 py-1 text-sm text-ink hover:bg-surface"
              >
                {localizationService.get("ChangeName")}
              </button>
            )}
          </div>

          <div>
            <p className="text-sm text-mute">{localizationService.get("AskedQuestions")}</p>
            <p className="mt-1 text-ink">{userData.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
