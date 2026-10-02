// src/components/ui/common/ModalAudio.tsx
"use client";
import { FC, ReactNode } from "react";
import { localizationService } from "@/services/localizationService";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const ModalAudio: FC<ModalProps> = ({ onClose, title, children }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="w-11/12 max-w-md rounded-2xl bg-white text-ink shadow-card">
      {title && (
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div>{children}</div>
      <div className="p-4 border-t text-right">
        <button
          className="rounded-full bg-accent px-4 py-2 text-sm text-white hover:bg-blue-600"
          onClick={onClose}
        >
          {localizationService.get("Close")}
        </button>
      </div>
    </div>
  </div>
);

export default ModalAudio;
