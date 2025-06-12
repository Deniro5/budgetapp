import styled from "styled-components";
import { BaseButton, PageTitle, SecondaryButton } from "styles";
import { SPACING } from "theme";
import { faAdd, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionOverlayType } from "../../Transactions";

type TransactionHeaderProps = {
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
};

function TransactionsHeader({ setActiveOverlay }: TransactionHeaderProps) {
  const handleAddClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD);
  };

  const handleAddTransferClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD_TRANSFER);
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
        <BaseButton onClick={handleAddTransferClick}>
          <FontAwesomeIcon icon={faAdd} />
          Account Transfer
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
