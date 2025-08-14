import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { transactionCategoryImageMap } from "../../constants/transactionCategoryImageMap";

import styled from "styled-components";
import { COLORS, SPACING } from "theme";
import {
  PresetTransaction,
  Transaction,
  TransactionCategory,
  TransactionType,
} from "types/Transaction";
import { capitalize, formatToCurrency } from "utils";
import { isPresetTransaction, isRecurringTransaction } from "../../utils";
import useAccounts from "../../../../../pages/Accounts/hooks/useAccounts";

type TransactionTableRowProps = {
  transaction: Transaction | PresetTransaction;
  onClick: (transaction: Transaction | PresetTransaction | null) => void;
  onRightClick: (
    e: React.MouseEvent<HTMLTableRowElement>,
    transaction: Transaction | PresetTransaction | null
  ) => void;
  onDoubleClick: (transaction: Transaction | PresetTransaction | null) => void;
  isSelected: boolean;
};

const emptyString = "N/A";

export function TransactionTableRow({
  transaction,
  onClick,
  onRightClick,
  onDoubleClick,
  isSelected,
}: TransactionTableRowProps) {
  const { accountNameByIdMap } = useAccounts();

  const handleClick = () => {
    if (isSelected) {
      onClick(null);
      return;
    }
    onClick(transaction);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleClick();
    onRightClick(e, transaction);
  };

  const handleDoubleClick = () => {
    onDoubleClick(transaction);
  };

  const getTransactionVendorName = () => {
    if (!transaction.vendor) return emptyString;

    return transaction.category === TransactionCategory.Transfer
      ? accountNameByIdMap[transaction.vendor]
      : transaction.vendor;
  };

  return (
    <Container
      onContextMenu={handleContextMenu}
      isSelected={isSelected}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isPresetTransaction(transaction) && (
        <td> {transaction.name || emptyString} </td>
      )}
      <td> {getTransactionVendorName()} </td>
      <td> {transaction.date ? transaction.date : emptyString} </td>
      <AmountTd transactionType={transaction.type}>
        {transaction.amount
          ? `${
              transaction.type === TransactionType.INCOME ? "+" : ""
            }${formatToCurrency(transaction.amount)}`
          : emptyString}
      </AmountTd>
      <CategoryTd>
        {transaction.category ? (
          <>
            <FontAwesomeIcon
              icon={transactionCategoryImageMap[transaction.category]}
              width={20}
              height={20}
            />
            {transaction.category}
          </>
        ) : (
          emptyString
        )}
      </CategoryTd>
      <td> {transaction.account?.name || emptyString} </td>
      {isRecurringTransaction(transaction) && (
        <td> {capitalize(transaction.interval)} </td>
      )}
    </Container>
  );
}

const Container = styled.tr<{ isSelected: boolean }>`
  color: ${COLORS.font};
  font-weight: 500;
  border-bottom: 1px solid ${COLORS.mediumGrey};
  cursor: pointer;
  background: ${({ isSelected }) =>
    isSelected ? COLORS.lightPrimary : COLORS.pureWhite};

  &:hover {
    background: ${COLORS.lightPrimary};
  }
  td {
    padding: ${SPACING.spacing5x};
    padding-left: ${SPACING.spacing8x};
    border-left: none; /* Hide vertical borders */
    border-right: none;
  }
`;

const AmountTd = styled.td<{ transactionType?: TransactionType }>`
  color: ${({ transactionType }) =>
    transactionType === TransactionType.INCOME && COLORS.green};
`;

const CategoryTd = styled.td`
  display: flex;
  align-items: center;
  gap: ${SPACING.spacing3x};

  svg {
    background: ${COLORS.lightPrimary};
    border-radius: 90px;
    padding: ${SPACING.spacing2x};
  }

  path {
    color: ${COLORS.primary};
  }
`;
