import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { TransactionTableRow } from "./TransactionTableRow";
import { PresetTransaction, Transaction } from "types/Transaction";
import { TransactionOverlayType } from "../../../transactions.types";
import { Waypoint } from "react-waypoint";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";
import useTransactionStore from "store/transaction/transactionStore";

type TransactionTableProps = {
  transactions: Transaction[] | PresetTransaction[];
  error: string | Error | null;
  loading: boolean;
  loadMore?: () => void;
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
  transactionLabel = "Transaction",
}: TransactionTableProps) {
  const {
    setActiveOverlay,
    setContextMenuPosition,
    setActiveTransaction,
    setSelectedTransactions,
    selectedTransactions,
    view,
  } = useTransactionStore();

  const isTransactionSelected = (id: string) =>
    selectedTransactions.some((t) => t._id === id);

  const handleClick = (
    e: React.MouseEvent,
    transaction: Transaction | PresetTransaction | null,
    index: number
  ) => {
    if (!transaction) return;

    // if command key is pressed
    if (e.metaKey) {
      if (isTransactionSelected(transaction._id)) {
        setSelectedTransactions(
          selectedTransactions.filter((t) => t._id !== transaction._id)
        );
      } else {
        setSelectedTransactions([...selectedTransactions, transaction]);
      }
    }
    // if shift key is pressed
    else if (e.shiftKey && !isTransactionSelected(transaction._id)) {
      //if there is a selected transaction before the current transaction or after , select the transactions in between. before takes precedent
      for (let i = index - 1; i >= 0; i--) {
        if (isTransactionSelected(transactions[i]._id)) {
          setSelectedTransactions([
            ...selectedTransactions,
            ...transactions.slice(i + 1, index + 1),
          ]);
          return;
        }
      }
      for (let i = index + 1; i < transactions.length; i++) {
        if (isTransactionSelected(transactions[i]._id)) {
          setSelectedTransactions([
            ...selectedTransactions,
            ...transactions.slice(index, i),
          ]);
          return;
        }
      }
      //if there is no selected transaction right now select all previous transactions in the list
      setSelectedTransactions([
        ...selectedTransactions,
        ...transactions.slice(0, index + 1),
      ]);
    }
    //if no key is pressed
    else {
      setActiveTransaction(transaction);
      setSelectedTransactions([transaction]);
    }
    setActiveTransaction(transaction);
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    transaction: Transaction | PresetTransaction | null
  ) => {
    if (!transaction) return;

    if (!isTransactionSelected(transaction._id)) {
      setSelectedTransactions([transaction]);
    }

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
              key={transaction._id}
              transaction={transaction}
              isSelected={isTransactionSelected(transaction._id)}
              onClick={handleClick}
              onRightClick={handleRightClick}
              onDoubleClick={handleDoubleClick}
              index={index}
            />
          ))}
          {!!loadMore && (
            <tr>
              <td colSpan={getTableColumns().length}>
                <Waypoint onEnter={loadMore} />
              </td>
            </tr>
          )}
        </ScrollBody>
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
