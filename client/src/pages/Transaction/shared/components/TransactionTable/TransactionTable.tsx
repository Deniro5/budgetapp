import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { TransactionTableRow } from "./TransactionTableRow";
import { PresetTransaction, Transaction } from "types/Transaction";
import { TransactionOverlayType, View } from "../../../TransactionsPage";
import { Waypoint } from "react-waypoint";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";

type TransactionTableProps = {
  transactions: Transaction[] | PresetTransaction[];
  error: string | Error | null;
  loading: boolean;
  sidebarTransactionId: string | null;
  loadMore?: () => void;
  setSidebarTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveTransaction: React.Dispatch<
    React.SetStateAction<Transaction | PresetTransaction | null>
  >;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
  setContextMenuPosition: React.Dispatch<
    React.SetStateAction<{ top: number; left: number }>
  >;
  view: View;
  transactionLabel?: string;
};

const transactionColumns = ["Vendor", "Date", "Amount", "Category", "Account"];
const presetTransactionColumns = [
  "Name",
  "Vendor",
  "Date",
  "Amount",
  "Category",
  "Account",
];

const recurringTransactionColumns = [
  "Vendor",
  "Next Date",
  "Amount",
  "Category",
  "Account",
  "Frequency",
];

export function TransactionTable({
  transactions,
  loadMore,
  loading,
  sidebarTransactionId,
  setActiveTransaction,
  setActiveOverlay,
  setContextMenuPosition,
  view,
  transactionLabel = "Transaction",
}: TransactionTableProps) {
  const handleRightClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    transaction: Transaction | PresetTransaction | null
  ) => {
    setActiveTransaction(transaction);
    setActiveOverlay(TransactionOverlayType.CONTEXT);
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
  };

  const handleDoubleClick = (
    transaction: Transaction | PresetTransaction | null
  ) => {
    setActiveTransaction(transaction);
    setActiveOverlay(TransactionOverlayType.EDIT);
  };

  const getTableColumns = () => {
    if (view === "Preset") return presetTransactionColumns;
    if (view === "Recurring") return recurringTransactionColumns;
    return transactionColumns;
  };

  if (loading) {
    return <SkeletonLoader height={40} rows={15} columns={1} />;
  }
  return (
    <TableWrapper>
      <ScrollableTable>
        <TableHead>
          <tr>
            {getTableColumns().map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </TableHead>
        <ScrollBody>
          {transactions.map((transaction, index) => (
            <TransactionTableRow
              key={index}
              transaction={transaction}
              isSelected={transaction._id === sidebarTransactionId}
              onClick={setActiveTransaction}
              onRightClick={handleRightClick}
              onDoubleClick={handleDoubleClick}
            />
          ))}
        </ScrollBody>
        {!!loadMore && <Waypoint onEnter={() => loadMore()} />}
      </ScrollableTable>
      {transactions.length === 0 && (
        <NoResult>
          No {transactionLabel}s to show. Create a {transactionLabel} by
          clicking the "Add {transactionLabel}" button at the top of the page.
        </NoResult>
      )}
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
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
  background-color: ${COLORS.lightPrimary};
  color: ${COLORS.primary};
  text-transform: uppercase;
  font-size: ${FONTSIZE.sm};
  position: sticky;
  top: 0;

  th {
    padding: ${SPACING.spacing3x};
    text-align: left;
    padding-left: ${SPACING.spacing8x};
  }
`;

const ScrollBody = styled.tbody``;

const NoResult = styled.p`
  text-align: center;
  font-size: ${FONTSIZE.lg};
`;
