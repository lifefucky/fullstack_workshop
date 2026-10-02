import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { localizationService } from "@/services/localizationService";
import InfoMessages from "./InfoMessages";

export default function AboutPanel({ type }: { type: "auth" | "demo" }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-white text-sm">
      <button
        type="button"
        onClick={() => setExpanded(open => !open)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="font-medium text-ink">{localizationService.get("ShowInfo")}</span>
        <span className="shrink-0 text-mute">
          {expanded ? localizationService.get("HideInfo") : "▾"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="overflow-hidden px-4 pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <InfoMessages type={type} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
