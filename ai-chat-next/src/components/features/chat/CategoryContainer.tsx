// src/components/features/chat/CategoryContainer.tsx
"use client";

import { FC } from "react";
import { CategoriesView } from "@features/chat/CategoryViews/CategoriesView";

type Props = {
  onSelect: (id: string, name: string) => void;
};

const CategoryContainer: FC<Props> = ({ onSelect }) => {
  return (
    <div className="p-4">
      <CategoriesView onSelect={onSelect} />
    </div>
  );
};

export default CategoryContainer;
