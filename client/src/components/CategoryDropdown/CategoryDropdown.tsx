import DropdownList from "components/DropdownList/DropdownList";
import { getUserTransactionCategories } from "store/user/userSelectors";
import { TransactionCategory } from "types/Transaction";
import { transactionCategoryNameMap } from "constants/transactionCategoryNameMap";

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
      itemToString={(item: TransactionCategory) =>
        transactionCategoryNameMap[item]
      }
      searchable
    />
  );
}
