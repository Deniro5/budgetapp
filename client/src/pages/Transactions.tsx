import { Flex, PageContainer } from "../Styles";
import TransactionTable from "../components/Transactions/TransactionTable";
import TransactionsSearchRow from "../components/Transactions/TransactionSearchRow/index.tsx";
import TransactionsHeader from "../components/Transactions/TransactionsHeader";
import TransactionSidebar from "../components/Transactions/TransactionSidebar.tsx";
import styled from "styled-components";
import { SPACING } from "../Theme.ts";
import TransactionsFilterRow from "../components/Transactions/TransactionFilterRow/index.tsx";
import { useState } from "react";

function Transactions() {
  const [hasFilters, setHasFilters] = useState(false);

  return (
    <PageContainer>
      <button onClick={() => setHasFilters(!hasFilters)}> </button>
      <TransactionsHeader />
      <PageColumnFlexContainer
        gap={hasFilters ? SPACING.spacing4x : SPACING.spacing9x}
      >
        <TransactionsSearchRow />
        {hasFilters && <TransactionsFilterRow />}
        <StyledTableContainer>
          <TransactionTable />
          <TransactionSidebar />
        </StyledTableContainer>
      </PageColumnFlexContainer>
    </PageContainer>
  );
}

const PageColumnFlexContainer = styled.div<{ gap: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap};
  margin-top: ${SPACING.spacing9x};
`;

const StyledTableContainer = styled(Flex)`
  align-items: stretch;
`;

export default Transactions;
