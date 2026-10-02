// ai-chat-next/src/components/features/common/VerificationSuccess.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Электронная почта успешно подтверждена!</h2>
        <p className="text-gray-700">Отправляемся на домашнюю страницу...</p>
      </div>
    </div>
  );
}
