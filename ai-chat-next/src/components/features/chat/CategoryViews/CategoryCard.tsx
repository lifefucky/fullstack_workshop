import { motion } from "framer-motion";

const tones = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-cyan-500",
];

interface CategoryCardProps {
  name: string;
  index: number;
  onClick: () => void;
}

export default function CategoryCard({ name, index, onClick }: CategoryCardProps) {
  const mark = name.trim().charAt(0).toUpperCase() || "•";

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex min-h-[7.5rem] w-[calc(50%-0.4rem)] max-w-[11.5rem] flex-col items-start gap-3 rounded-2xl border border-line bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md sm:w-44"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-white ${tones[index % tones.length]}`}
      >
        {mark}
      </span>
      <span className="text-sm font-semibold leading-snug text-ink">{name}</span>
    </motion.button>
  );
}
