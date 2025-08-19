import DropdownList from "components/DropdownList/DropdownList";
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
  const { activeAccountIds, accountNameByIdMap } = useAccounts();

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
