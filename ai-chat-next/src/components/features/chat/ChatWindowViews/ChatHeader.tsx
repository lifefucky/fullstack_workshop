// src/components/features/chat/ChatWindowViews/ChatHeader.tsx
import ModalAudio from "@ui/common/ModalAudio";
import SoundVolume from "../../common/SoundVolume";
import { localizationService } from "@/services/localizationService";

interface ChatHeaderProps {
  categoryName: string;
  audioModalOpen: boolean;
  setAudioModalOpen: (value: boolean) => void;
  onBack?: () => void;
}

export const ChatHeader = ({
  categoryName,
  audioModalOpen,
  setAudioModalOpen,
  onBack,
}: ChatHeaderProps) => (
  <>
    <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-full border border-line bg-white px-3 py-1 text-sm text-ink hover:bg-surface"
          >
            ← {localizationService.get("Back")}
          </button>
        )}
        <h2 className="truncate text-lg font-semibold text-ink">{categoryName}</h2>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-full border border-line bg-white px-3 py-1 text-sm text-ink hover:bg-surface"
        onClick={() => setAudioModalOpen(true)}
      >
        {localizationService.get("AudioSettings")}
      </button>
    </div>

    {audioModalOpen && (
      <ModalAudio
        title={localizationService.get("AudioSettings")}
        onClose={() => setAudioModalOpen(false)}
      >
        <SoundVolume />
      </ModalAudio>
    )}
  </>
);
