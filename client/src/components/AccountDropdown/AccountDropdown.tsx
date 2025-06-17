import DropdownList from "components/DropdownList/DropdownList";

import {
  getAccountids,
  getAccountNameByIdMap,
} from "store/account/accountSelectors";

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
  const accountIds = getAccountids();
  const accountNameByIdMap = getAccountNameByIdMap();

  return (
    <DropdownList
      items={accountsList || accountIds}
      selected={selectedAccountId}
      onSelect={handleAccountChange}
      placeholder={placeholder || "Select Account"}
      itemToString={(item: string) => accountNameByIdMap[item]}
      searchable
    />
  );
}
