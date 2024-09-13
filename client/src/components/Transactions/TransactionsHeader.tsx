import styled from "styled-components";
import { FONTSIZE, SPACING } from "../../Theme";
import { faAdd, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton, PageTitle, SecondaryButton } from "../../Styles";

function TransactionsHeader() {
  return (
    <Container>
      <PageTitle> Transactions </PageTitle>
      <ButtonContainer>
        <SecondaryButton>
          <FontAwesomeIcon icon={faFolderPlus} />
          Add Preset Transaction
        </SecondaryButton>
        <TransactionButton>
          <FontAwesomeIcon icon={faAdd} />
          Add Transaction{" "}
        </TransactionButton>
      </ButtonContainer>
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

const ButtonContainer = styled.div`
  display: flex;
  gap: ${SPACING.spacing6x};
`;

export default TransactionsHeader;
