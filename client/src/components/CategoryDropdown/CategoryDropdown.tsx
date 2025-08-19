import DropdownList from "components/DropdownList/DropdownList";
import { getUserTransactionCategories } from "store/user/userSelectors";
import useUserStore from "store/user/userStore";
import { TransactionCategory } from "types/Transaction";

interface CategoryDropdownProps {
  selectedCategory: TransactionCategory | null;
  handleCategoryChange: (category: TransactionCategory) => void;
  categoriesList?: TransactionCategory[];
  placeholder?: string;
}

export default function CategoryDropdown({
  selectedCategory,
  handleCategoryChange,
  categoriesList,
  placeholder,
}: CategoryDropdownProps) {
  const userTransactionCategories = getUserTransactionCategories();

  return (
    <DropdownList
      items={categoriesList || userTransactionCategories}
      selected={selectedCategory}
      onSelect={handleCategoryChange}
      placeholder={placeholder || "Select Category"}
      itemToString={(item: TransactionCategory) => item}
      searchable
    />
  );
}
