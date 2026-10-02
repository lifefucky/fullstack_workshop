import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { localizationService } from "@/services/localizationService";
import { demoCategories } from "@/data/demoChat";
import CategoryCard from "./CategoryCard";
import InfoMessages from "./InfoMessages";

interface DemoCategoriesViewProps {
  onSelect?: (id: string, name: string) => void;
}

export default function DemoCategoriesView({ onSelect }: DemoCategoriesViewProps) {
  const [expandedInfo, setExpandedInfo] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex flex-wrap justify-center gap-3">
        {demoCategories.map((cat, index) => (
          <CategoryCard
            key={cat.id}
            name={cat.name}
            index={index}
            onClick={() => onSelect?.(cat.id, cat.name)}
          />
        ))}
      </div>

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
                <InfoMessages type="demo" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
