import DropdownList from "components/DropdownList/DropdownList";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";
import useAccounts from "pages/Accounts/hooks/useAccounts";
import { ALL_ACCOUNTS } from "types/account";

interface AccountDropdownProps {
  selectedAccountId: string | null;
  handleAccountChange: (account: string) => void;
  placeholder?: string;
  hasAllOption?: boolean;
  filteredAccountIdList?: string[];
}

export default function AccountDropdown({
  selectedAccountId,
  handleAccountChange,
  placeholder,
  hasAllOption,
  filteredAccountIdList = [],
}: AccountDropdownProps) {
  const { activeAccountIds, accountNameByIdMap, isLoading } = useAccounts();

  //add the all option and then filter by filteredAccountIdList if there is one
  const items = [
    ...(hasAllOption
      ? [
          {
            key: ALL_ACCOUNTS,
            label: ALL_ACCOUNTS,
            function: () => handleAccountChange(ALL_ACCOUNTS),
          },
        ]
      : []),
    ...activeAccountIds
      .filter((accountId) => filteredAccountIdList.includes(accountId))
      .map((accountId) => {
        return {
          key: accountId,
          label: accountNameByIdMap[accountId] || accountId,
          function: () => handleAccountChange(accountId),
        };
      }),
  ];

  if (isLoading)
    return <SkeletonLoader rows={1} columns={1} height={44}></SkeletonLoader>;

  const selectedLabel =
    (selectedAccountId && accountNameByIdMap[selectedAccountId]) ??
    selectedAccountId;

  return (
    <DropdownList
      items={items}
      selected={selectedLabel}
      placeholder={placeholder || "Select Account"}
      searchable
    />
  );
}
