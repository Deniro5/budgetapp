import DropdownList from "components/DropdownList/DropdownList";
import { getUserTransactionCategories } from "store/user/userSelectors";
import { TransactionCategory } from "types/Transaction";

interface CategoryDropdownProps {
  selectedCategory: TransactionCategory | null;
  handleCategoryChange: (category: TransactionCategory) => void;
  placeholder?: string;
}

export default function CategoryDropdown({
  selectedCategory,
  handleCategoryChange,
  placeholder,
}: CategoryDropdownProps) {
  const userTransactionCategories = getUserTransactionCategories();

  const items = userTransactionCategories.map((category) => {
    return {
      label: category,
      function: () => handleCategoryChange(category),
    };
  });

  return (
    <DropdownList
      items={items}
      selected={selectedCategory}
      placeholder={placeholder || "Select Category"}
      itemToString={(item: TransactionCategory) => item}
      searchable
    />
  );
}
