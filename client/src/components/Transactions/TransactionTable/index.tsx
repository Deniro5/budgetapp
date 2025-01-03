import styled from "styled-components";
import { COLORS, SPACING } from "../../../Theme";
import TransactionTableRow from "./TransactionTableRow";
import TransactionTableAddRow from "./TransactionTableAddRow";
import { Transaction } from "../../../types/transaction";
import { TransactionOverlayType } from "../../../pages/Transactions";

type TransactionTableProps = {
  transactions: Transaction[];
  error: string | null;
  loading: boolean;
  sidebarTransactionId: string | null;
  setSidebarTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
  setContextMenuPosition: React.Dispatch<
    React.SetStateAction<{ top: number; left: number }>
  >;
};

const tableColumns = ["Name", "Amount", "Type", "Date", "Account", "Category"];

function TransactionTable({
  transactions,
  error,
  loading,
  sidebarTransactionId,
  setSidebarTransactionId,
  setActiveTransaction,
  setActiveOverlay,
  setContextMenuPosition,
}: TransactionTableProps) {
  const handleRightClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    transaction: Transaction | null
  ) => {
    setActiveTransaction(transaction);
    setActiveOverlay(TransactionOverlayType.CONTEXT);
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
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
          {/* <TransactionTableAddRow handleClick={handleAddClick} /> */}
          {transactions.map((transaction, index) => (
            <TransactionTableRow
              key={index}
              transaction={transaction}
              isSelected={transaction._id === sidebarTransactionId}
              onClick={setSidebarTransactionId}
              onRightClick={handleRightClick}
            />
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
