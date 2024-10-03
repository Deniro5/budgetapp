import styled from "styled-components";
import { SPACING } from "../../../Theme";
import TransactionFilterTag from "./TransactionFilterTag";

function TransactionsFilterRow() {
  return (
    <Container>
      Filtering By
      <TransactionFilterTag name="Account: Joint" />
      <TransactionFilterTag name="Account: Joint" />
      <TransactionFilterTag name="Account: Joint" />
      <TransactionFilterTag name="Account: Joint" />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.spacing4x};
  height: 48px;
  width: 100%;
  font-weight: 600;
`;

export default TransactionsFilterRow;
