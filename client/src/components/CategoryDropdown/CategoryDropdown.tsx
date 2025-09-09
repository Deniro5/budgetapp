import DropdownList from "components/DropdownList/DropdownList";
import { getUserTransactionCategories } from "store/user/userSelectors";
import { TransactionCategory } from "types/Transaction";

interface CategoryDropdownProps {
  handleCategoryChange: (category: TransactionCategory) => void;
  placeholder?: string;
  selectedCategory: string | null;
}

export default function CategoryDropdown({
  handleCategoryChange,
  placeholder,
  selectedCategory,
}: CategoryDropdownProps) {
  const userTransactionCategories = getUserTransactionCategories();

  const items = userTransactionCategories.map((category) => {
    return {
      key: category,
      label: category,
      function: () => handleCategoryChange(category),
    };
  });

  return (
    <DropdownList
      items={items}
      selected={selectedCategory}
      placeholder={placeholder || "Select Category"}
      searchable
    />
  );
}
