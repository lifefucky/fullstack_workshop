import { motion } from "framer-motion";
import { demoCategories } from "@/data/demoChat";
import CategoryCard from "./CategoryCard";
import AboutPanel from "./AboutPanel";

interface DemoCategoriesViewProps {
  onSelect?: (id: string, name: string) => void;
}

export default function DemoCategoriesView({ onSelect }: DemoCategoriesViewProps) {
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

      <AboutPanel type="demo" />
    </motion.div>
  );
}
