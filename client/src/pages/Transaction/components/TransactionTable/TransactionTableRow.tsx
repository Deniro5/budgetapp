import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { transactionCategoryImageMap } from "../../constants/transactionCategoryImageMap";

import useAccountStore from "store/account/accountStore";
import styled from "styled-components";
import { COLORS, SPACING } from "theme";
import {
  Transaction,
  TransactionCategory,
  TransactionType,
} from "types/Transaction";
import { getDollarValue } from "utils";

type TransactionTableRowProps = {
  transaction: Transaction;
  onClick: (transaction: Transaction | null) => void;
  onRightClick: (
    e: React.MouseEvent<HTMLTableRowElement>,
    transaction: Transaction | null
  ) => void;
  onDoubleClick: (transaction: Transaction | null) => void;
  isSelected: boolean;
};

function TransactionTableRow({
  transaction,
  onClick,
  onRightClick,
  onDoubleClick,
  isSelected,
}: TransactionTableRowProps) {
  const { accountIdToNameMap } = useAccountStore();

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

  const transactionVendorName =
    transaction.category === TransactionCategory.Transfer
      ? accountIdToNameMap[transaction.vendor]
      : transaction.vendor;

  return (
    <Container
      onContextMenu={handleContextMenu}
      isSelected={isSelected}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <td> {transactionVendorName} </td>
      <td> {transaction.date} </td>
      <AmountTd transactionType={transaction.type}>
        {transaction.type === TransactionType.INCOME && "+"}
        {getDollarValue(transaction.amount)}{" "}
      </AmountTd>
      <CategoryTd>
        <FontAwesomeIcon
          icon={transactionCategoryImageMap[transaction.category]}
          width={20}
          height={20}
        />
        {transaction.category}
      </CategoryTd>
      <td> {transaction.account.name} </td>
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

const AmountTd = styled.td<{ transactionType: TransactionType }>`
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

export default TransactionTableRow;
