// ai-chat-next/src/components/ui/common/Modal.tsx
import React from "react";

/**
 * Базовый компонент модального окна.
 * @param children - Контент модалки
 * @param onClose - Функция закрытия
 */
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative rounded-2xl bg-white p-6 text-ink shadow-card">
        <button
          onClick={onClose}
          className="absolute right-3 top-2 text-mute hover:text-ink"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
