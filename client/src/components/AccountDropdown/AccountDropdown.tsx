import DropdownList from "components/DropdownList/DropdownList";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";
import useAccounts from "pages/Accounts/hooks/useAccounts";
import { ALL_ACCOUNTS } from "types/account";

interface AccountDropdownProps {
  selectedAccountId: string | null;
  handleAccountChange: (account: string) => void;
  placeholder?: string;
  hasAllOption?: boolean;
}

export default function AccountDropdown({
  selectedAccountId,
  handleAccountChange,
  placeholder,
  hasAllOption,
}: AccountDropdownProps) {
  const { activeAccountIds, accountNameByIdMap, isLoading } = useAccounts();

  const items = [
    ...(hasAllOption
      ? [
          {
            label: ALL_ACCOUNTS,
            function: () => handleAccountChange(ALL_ACCOUNTS),
          },
        ]
      : []),
    ...activeAccountIds.map((accountId) => {
      return {
        label: accountNameByIdMap[accountId] || accountId,
        function: () => handleAccountChange(accountId),
      };
    }),
  ];

  if (isLoading)
    return <SkeletonLoader rows={1} columns={1} height={44}></SkeletonLoader>;

  return (
    <DropdownList
      items={items}
      selected={selectedAccountId}
      placeholder={placeholder || "Select Account"}
      itemToString={(item: string) => accountNameByIdMap[item] || item}
      searchable
    />
  );
}
