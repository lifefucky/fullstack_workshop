"use client";

import { useSession } from "next-auth/react";
import { useGetCategoriesQuery } from "@/services/chatApi";
import AuthRequiredView from "./CategoryViews/AuthRequiredView";
import CategoriesView from "./CategoryViews/CategoriesView";

interface CategoryContainerProps {
  onSelect: (id: string, name: string) => void;
}

const CategoryContainer = ({ onSelect }: CategoryContainerProps) => {
  const { data: session } = useSession();

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery(undefined, {
    skip: !session,
  });

  if (!session) {
    return <AuthRequiredView onSelect={onSelect} />;
  }

  return (
    <CategoriesView
      categories={categories}
      isLoading={isLoading}
      error={error}
      onSelect={onSelect}
      onRetry={refetch}
    />
  );
};

export default CategoryContainer;
