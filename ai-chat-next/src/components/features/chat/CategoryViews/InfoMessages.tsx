import { infoMessages } from "@/data/infoMessages";
import { localizationService } from "@/services/localizationService";

interface InfoMessagesProps {
  type: "auth" | "demo";
}

export default function InfoMessages({ type }: InfoMessagesProps) {
  const lang = localizationService.getCurrentLanguage() === "ru" ? "ru" : "en";
  const messages = infoMessages[lang]?.[type] ?? [];

  return (
    <div className="space-y-3 text-sm text-ink">
      {messages.map(message => (
        <p key={message.id}>{message.text}</p>
      ))}
    </div>
  );
}
