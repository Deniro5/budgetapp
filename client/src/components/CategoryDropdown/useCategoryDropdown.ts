import React from "react";
import { getUserTransactionCategories } from "store/user/userSelectors";

export function useCategoryDropdown() {
  const userTransactionCategories = getUserTransactionCategories();

  const items = userTransactionCategories.map((category) => {
    return {
      label: category,
      function: () => handleCategoryChange(category),
    };
  });

  return <div>useCategoryDropdown</div>;
}
