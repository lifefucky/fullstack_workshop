// ai-chat-next/src/components/features/common/VerificationSuccess.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { localizationService } from "@/services/localizationService";

export default function VerificationSuccess() {
  const router = useRouter();

  // Перенаправление на домашнюю страницу через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-card">
        <h2 className="mb-4 text-2xl font-semibold text-ink">
          {localizationService.get("EmailVerifiedTitle")}
        </h2>
        <p className="text-mute">{localizationService.get("EmailVerifiedBody")}</p>
      </div>
    </div>
  );
}
