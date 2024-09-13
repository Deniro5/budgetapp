import styled from "styled-components";
import { PageContainer, PageTitle } from "../Styles";
import { COLORS, SPACING } from "../../../Theme";
import TransactionTableRow from "./TransactionTableRow";

const tableColumns = ["Name", "Amount", "Type", "Date", "Account", "Category"];
const tableRows = [
  {
    name: "Walmart",
    amount: 200.0,
    type: "Income",
    date: "26 Sep 2024",
    account: "Joint",
    category: "Transit",
  },
  {
    name: "Walmart",
    amount: 200.0,
    type: "Income",
    date: "26 Sep 2024",
    account: "Joint",
    category: "Transit",
  },
  {
    name: "Walmart",
    amount: 200.0,
    type: "Income",
    date: "26 Sep 2024",
    account: "Joint",
    category: "Transit",
  },
  {
    name: "Walmart",
    amount: 200.0,
    type: "Income",
    date: "26 Sep 2024",
    account: "Joint",
    category: "Transit",
  },
  {
    name: "Walmart",
    amount: 200.0,
    type: "Income",
    date: "26 Sep 2024",
    account: "Joint",
    category: "Transit",
  },
  {
    name: "Walmart",
    amount: 200.0,
    type: "Income",
    date: "26 Sep 2024",
    account: "Joint",
    category: "Transit",
  },
];

function TransactionTable() {
  return (
    <TableWrapper>
      <ScrollableTable>
        <TableHead>
          <tr>
            {tableColumns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </TableHead>
        <ScrollBody>
          {tableRows.map((transaction, index) => (
            <TransactionTableRow key={index} transaction={transaction} />
          ))}
          {tableRows.map((transaction, index) => (
            <TransactionTableRow key={index} transaction={transaction} />
          ))}
          {tableRows.map((transaction, index) => (
            <TransactionTableRow key={index} transaction={transaction} />
          ))}
          {tableRows.map((transaction, index) => (
            <TransactionTableRow key={index} transaction={transaction} />
          ))}
        </ScrollBody>
      </ScrollableTable>
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 240px);
  margin-top: ${SPACING.spacing9x};
  border: 1px solid ${COLORS.mediumGrey};
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Optional: hide scrollbar for IE/Edge */
  -ms-overflow-style: none;
`;

const ScrollableTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${COLORS.primary};
  color: ${COLORS.pureWhite};
  position: sticky;
  top: 0;

  th {
    padding: 10px;
    text-align: center;
  }
`;

const ScrollBody = styled.tbody``;

export default TransactionTable;
