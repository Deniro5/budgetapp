import styled from "styled-components";
import { SPACING } from "theme";
import TransactionFilterTag from "./TransactionFilterTag";
import { TransactionFilter } from "types/Transaction";
import { formatCamelCaseToTitleCase } from "utils";
import useAccountStore from "store/account/accountStore";

type TransactionFilterRowProps = {
  filter: TransactionFilter;
  setFilter: React.Dispatch<React.SetStateAction<TransactionFilter>>;
};

function TransactionFilterRow({
  filter,
  setFilter,
}: TransactionFilterRowProps) {
  const { accountIdToNameMap } = useAccountStore();
  const removeFilter = (filterName: keyof TransactionFilter) => {
    setFilter({ ...filter, [filterName]: undefined });
  };

  const getFilterLabel = (key: keyof TransactionFilter) => {
    let label: string | number | string[];
    if (key === "account") {
      label = accountIdToNameMap[filter[key]!] || "";
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

export default TransactionFilterRow;
