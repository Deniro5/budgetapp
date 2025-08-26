import DropdownList from "components/DropdownList/DropdownList";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";
import useAccounts from "pages/Accounts/hooks/useAccounts";

interface AccountDropdownProps {
  selectedAccountId: string | null;
  handleAccountChange: (account: string) => void;
  accountsList?: string[];
  placeholder?: string;
}

export default function AccountDropdown({
  selectedAccountId,
  handleAccountChange,
  accountsList,
  placeholder,
}: AccountDropdownProps) {
  const { activeAccountIds, accountNameByIdMap, isLoading } = useAccounts();

  if (isLoading)
    return <SkeletonLoader rows={1} columns={1} height={44}></SkeletonLoader>;

  return (
    <DropdownList
      items={accountsList || activeAccountIds}
      selected={selectedAccountId}
      onSelect={handleAccountChange}
      placeholder={placeholder || "Select Account"}
      itemToString={(item: string) => accountNameByIdMap[item] || item}
      searchable
    />
  );
}
