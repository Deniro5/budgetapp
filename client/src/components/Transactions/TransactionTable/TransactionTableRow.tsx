import styled from "styled-components";
import { COLORS, SPACING } from "../../../Theme";
import { TransactionType } from "../types";

type TransactionTableRowProps = {
  transaction: TransactionType;
};

function TransactionTableRow({ transaction }: TransactionTableRowProps) {
  return (
    <Container>
      <td> {transaction.name} </td>
      <td> {transaction.amount} </td>
      <td> {transaction.type} </td>
      <td> {transaction.date} </td>
      <td> {transaction.account} </td>
      <td> {transaction.category} </td>
    </Container>
  );
}

const Container = styled.tr`
  color: ${COLORS.font};
  font-weight: 500;
  border-bottom: 1px solid ${COLORS.mediumGrey};
  td {
    text-align: center;
    padding: ${SPACING.spacing4x};
    border-left: none; /* Hide vertical borders */
    border-right: none; /* Hide vertical borders */
  }
`;

export default TransactionTableRow;
