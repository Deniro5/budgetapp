import styled from "styled-components";

import TransactionsHeaderAddButton from "./TransactionsHeaderAddButton";
import { BaseButton, PageTitle, SecondaryButton } from "../../../Styles";
import { SPACING } from "../../../Theme";
import TransactionsHeaderPresetButton from "./TransactionsHeaderPresetButton";
import { faAdd, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionOverlayType } from "../../../pages/Transactions";
import { Transaction } from "../../../types/transaction";

type TransactionHeaderProps = {
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
};

function TransactionsHeader({ setActiveOverlay }: TransactionHeaderProps) {
  const handleAddClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD);
  };

  const handlePresetClick = () => {
    setActiveOverlay(TransactionOverlayType.PRESET);
  };
  return (
    <Container>
      <PageTitle> Transactions </PageTitle>
      <ButtonContainer>
        <BaseButton onClick={handleAddClick}>
          <FontAwesomeIcon icon={faAdd} />
          Add Transaction{" "}
        </BaseButton>
        <SecondaryButton onClick={handlePresetClick}>
          <FontAwesomeIcon icon={faFolderPlus} />
          Manage Preset Transactions{" "}
        </SecondaryButton>
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
