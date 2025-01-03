import styled from "styled-components";
import { COLORS, SPACING } from "../../../Theme";
import { Transaction } from "../../../types/transaction";
import { getDollarValue } from "../../../utils";

type TransactionTableRowProps = {
  transaction: Transaction;
  onClick: (transactionId: string | null) => void;
  onRightClick: (
    e: React.MouseEvent<HTMLTableRowElement>,
    transaction: Transaction | null
  ) => void;
  isSelected: boolean;
};

function TransactionTableRow({
  transaction,
  onClick,
  onRightClick,
  isSelected,
}: TransactionTableRowProps) {
  const handleClick = () => {
    if (isSelected) {
      onClick(null);
      return;
    }
    onClick(transaction._id);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onRightClick(e, transaction);
  };

  return (
    <Container
      onContextMenu={handleContextMenu}
      isSelected={isSelected}
      onClick={handleClick}
    >
      <td> {transaction.name} </td>
      <td> {getDollarValue(transaction.amount)} </td>
      <td> {transaction.type} </td>
      <td> {transaction.date} </td>
      <td> {transaction.account} </td>
      <td> {transaction.category} </td>
    </Container>
  );
}

const Container = styled.tr<{ isSelected: boolean }>`
  color: ${COLORS.font};
  font-weight: 500;
  border-bottom: 1px solid ${COLORS.mediumGrey};
  cursor: pointer;
  background: ${({ isSelected }) => isSelected && COLORS.lightGrey};

  &:hover {
    background: ${COLORS.lightGrey};
  }
  td {
    text-align: center;
    padding: ${SPACING.spacing4x};
    border-left: none; /* Hide vertical borders */
    border-right: none; /* Hide vertical borders */
  }
`;

export default TransactionTableRow;
