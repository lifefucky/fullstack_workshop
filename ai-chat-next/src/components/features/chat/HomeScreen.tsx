"use client";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { showNotification } from "@/reducers/notificationReducer";
import { localizationService } from "@/services/localizationService";
import { useUserSession } from "@/hooks/useUserSession";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useCreateCategoryMutation, useCreateQuestionMutation } from "@/services/chatApi";
import CategoryContainer from "@features/chat/CategoryContainer";
import { ChatInputForm } from "@features/chat/ChatWindowViews/ChatInputForm";

interface HomeScreenProps {
  onSelect: (id: string, name: string) => void;
}

function titleFromPrompt(prompt: string) {
  return prompt.trim().split(/\s+/).slice(0, 4).join(" ").slice(0, 100);
}

export default function HomeScreen({ onSelect }: HomeScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { userName } = useUserSession();
  const { modelType, selectedModel } = useSelector((state: RootState) => state.model);
  useSelector((state: RootState) => state.language.current);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const [createCategory] = useCreateCategoryMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const startListening = useSpeechRecognition(setInput);

  const named = userName && userName !== "🫥" ? userName : "";
  const greeting = named
    ? localizationService.get("Greeting", { name: named })
    : localizationService.get("GreetingFallback");

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isSending) return;
    if (!selectedModel) {
      dispatch(showNotification(localizationService.get("ErrorSendingQuestion"), "error", 3));
      return;
    }

    setIsSending(true);
    try {
      const category = await createCategory({ name: titleFromPrompt(prompt) }).unwrap();
      try {
        await createQuestion({
          categoryId: category.id,
          prompt,
          model: selectedModel,
          model_type: modelType,
          category_id: category.id,
          language: localizationService.getCurrentLanguage(),
        }).unwrap();
      } catch {
        dispatch(showNotification(localizationService.get("ErrorSendingQuestion"), "error", 3));
      }
      setInput("");
      onSelect(category.id, category.name);
    } catch {
      dispatch(showNotification(localizationService.get("CategoryCreatedError"), "error", 3));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 md:px-8">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {greeting}
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-mute md:text-base">
          {localizationService.get("HomeSubtitle")}
        </p>
        <div className="mt-8 w-full">
          <CategoryContainer onSelect={onSelect} />
        </div>
        <div className="mt-6 w-full">
          <ChatInputForm
            input={input}
            setInput={setInput}
            send={send}
            isSending={isSending}
            startListening={startListening}
            sendButtonRef={sendButtonRef}
          />
        </div>
      </div>
    </div>
  );
}
