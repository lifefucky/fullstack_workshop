// src/components/features/chat/CategoryViews/CategoriesView.tsx
"use client";

import { FC } from "react";
import { demoCategories } from "@/data/demoChat";

type Props = {
  onSelect: (id: string, name: string) => void;
};

export const CategoriesView: FC<Props> = ({ onSelect }) => (
  <>
    {demoCategories.map((cat) => (
      <button
        key={cat.id}
        className="block w-full text-left px-3 py-2 mb-2 border rounded hover:bg-gray-100 text-white"
        onClick={() => onSelect(cat.id, cat.name)}
      >
        {cat.name}
      </button>
    ))}
  </>
);
