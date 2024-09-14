import { PageContainer } from "../Styles";
import TransactionTable from "../components/Transactions/TransactionTable";
import TransactionsSearchRow from "../components/Transactions/TransactionSearchRow";
import TransactionsHeader from "../components/Transactions/TransactionsHeader";

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
