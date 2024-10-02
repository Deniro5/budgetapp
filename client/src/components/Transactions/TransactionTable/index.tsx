import styled from "styled-components";
import { COLORS, SPACING } from "../../../Theme";
import TransactionTableRow from "./TransactionTableRow";
import TransactionTableAddRow from "./TransactionTableAddRow";

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
    name: "Petro Canada",
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
  const handleAddClick = () => {
    alert("add transaction");
  };

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
          <TransactionTableAddRow handleClick={handleAddClick} />
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
  position: relative;
`;

const TableHead = styled.thead`
  background-color: ${COLORS.primary};
  color: ${COLORS.pureWhite};
  position: sticky;
  top: 0;

  th {
    padding: ${SPACING.spacing3x};
    text-align: center;
  }
  }
`;

const ScrollBody = styled.tbody``;

export default TransactionTable;
