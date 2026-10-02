import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { localizationService } from "@/services/localizationService";
import InfoMessages from "./InfoMessages";

interface CategoriesViewProps {
  categories?: Array<{ id: string; name: string }>;
  isLoading: boolean;
  error: unknown;
  onSelect: (id: string, name: string) => void;
  onRetry: () => void;
}

export default function CategoriesView({
  categories,
  isLoading,
  error,
  onSelect,
  onRetry,
}: CategoriesViewProps) {
  const [expandedInfo, setExpandedInfo] = useState(false);

  if (isLoading) {
    return <div className="py-8 text-center text-mute">{localizationService.get("LoadingCategories")}</div>;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2 py-8 text-center text-red-500"
      >
        <p>{localizationService.get("ServerUnavailable")}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-accent px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          {localizationService.get("Retry")}
        </button>
      </motion.div>
    );
  }

  const reversedCategories = categories ? [...categories].reverse() : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {reversedCategories.length === 0 ? (
        <p className="py-6 text-center text-sm text-mute">{localizationService.get("EmptyChats")}</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {reversedCategories.map((cat, index) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              index={index}
              onClick={() => onSelect(cat.id, cat.name)}
            />
          ))}
        </div>
      )}

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-mute">
          <button
            type="button"
            onClick={() => setExpandedInfo(!expandedInfo)}
            className="text-sm font-medium text-ink"
          >
            {expandedInfo ? localizationService.get("HideInfo") : localizationService.get("ShowInfo")}
          </button>
          <AnimatePresence initial={false}>
            {expandedInfo && (
              <motion.div
                className="mt-3 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <InfoMessages type="auth" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
