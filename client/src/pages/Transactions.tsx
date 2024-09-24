import { Flex, PageContainer } from "../Styles";
import TransactionTable from "../components/Transactions/TransactionTable";
import TransactionsSearchRow from "../components/Transactions/TransactionFilterRow";
import TransactionsHeader from "../components/Transactions/TransactionsHeader";
import TransactionSidebar from "../components/Transactions/TransactionSidebar.tsx";
import styled from "styled-components";
import { SPACING } from "../Theme.ts";

function Transactions() {
  return (
    <PageContainer>
      <TransactionsHeader />
      <TransactionsSearchRow />
      <StyledFlex>
        <TransactionTable />
        <TransactionSidebar />
      </StyledFlex>
    </PageContainer>
  );
}

const StyledFlex = styled(Flex)`
  align-items: stretch;
  margin-top: ${SPACING.spacing9x};
`;

export default Transactions;
