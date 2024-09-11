import { PageContainer, PageTitle } from "../Styles";
import TransactionTable from "../components/Transactions/TransactionTable";
import TransactionsHeader from "../components/Transactions/TransactionsHeader";
import TransactionsSearchRow from "../components/Transactions/TransactionsSearchRow";

function Transactions() {
  return (
    <PageContainer>
      <TransactionsHeader />
      <TransactionsSearchRow />
      <TransactionTable />
    </PageContainer>
  );
}

export default Transactions;
