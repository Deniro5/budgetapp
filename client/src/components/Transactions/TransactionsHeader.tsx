import styled from "styled-components";
import { FONTSIZE, SPACING } from "../../Theme";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton, PageTitle } from "../../Styles";

function TransactionsHeader() {
  return (
    <Container>
      <PageTitle> Transactions </PageTitle>
      <TransactionButton>
        <FontAwesomeIcon icon={faAdd} />
        Add Transaction{" "}
      </TransactionButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${SPACING.spacing6x};
`;

const TransactionButton = styled(BaseButton)`
  gap: 8px;
`;

export default TransactionsHeader;
