import styled from "styled-components";

import TransactionsHeaderAddButton from "./TransactionsHeaderAddButton";
import { PageTitle } from "../../../Styles";
import { SPACING } from "../../../Theme";
import TransactionsHeaderPresetButton from "./TransactionsHeaderPresetButton";

function TransactionsHeader() {
  return (
    <Container>
      <PageTitle> Transactions </PageTitle>
      <ButtonContainer>
        <TransactionsHeaderPresetButton />
        <TransactionsHeaderAddButton />
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

const ButtonContainer = styled.div`
  display: flex;
  gap: ${SPACING.spacing6x};
`;

export default TransactionsHeader;
