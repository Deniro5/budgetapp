import styled from "styled-components";
import { SPACING } from "theme";
import { TransactionFilterTag } from "./TransactionFilterTag";
import { TransactionFilter } from "types/Transaction";
import { formatCamelCaseToTitleCase, formatToCurrency } from "utils";
import useTransactionStore from "store/transaction/transactionStore";
import useAccounts from "../../../../../pages/Accounts/hooks/useAccounts";

export function TransactionFilterRow() {
  const { filter, setFilter } = useTransactionStore();
  const { accountNameByIdMap } = useAccounts();

  console.log(filter);
  const removeFilter = (filterName: keyof TransactionFilter) => {
    setFilter({ ...filter, [filterName]: undefined });
  };

  const getFilterLabel = (key: keyof TransactionFilter) => {
    let label: string | number | string[];
    if (key === "account") {
      label = accountNameByIdMap[filter[key]!] || "";
    } else if (key === "maxAmount" || key === "minAmount") {
      label = formatToCurrency(filter[key] || 0);
    } else {
      label = filter[key] || "";
    }
    return `${formatCamelCaseToTitleCase(key)} : ${label}`;
  };

  return (
    <Container>
      Filtering By
      {Object.keys(filter).map((filterName) => {
        const key = filterName as keyof TransactionFilter;
        return filter[key] ? (
          <TransactionFilterTag
            name={getFilterLabel(key)}
            onClick={() => removeFilter(key)}
          />
        ) : null;
      })}
      <TransactionFilterTag
        name={"Clear Filters"}
        onClick={() => setFilter({})}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.spacing4x};
  height: 48px;
  width: 100%;
  font-weight: 600;
`;
