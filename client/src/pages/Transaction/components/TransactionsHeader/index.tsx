import styled from "styled-components";
import { BaseButton, Flex, PageTitle, SecondaryButton } from "styles";
import { SPACING } from "theme";
import { faAdd, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionOverlayType, View } from "../../Transactions";
import { Toggle } from "components/Toggle/Toggle";

type TransactionHeaderProps = {
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
};

function TransactionsHeader({
  setActiveOverlay,
  view,
  setView,
}: TransactionHeaderProps) {
  const handleAddClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD);
  };

  const handleAddTransferClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD_TRANSFER);
  };

  const handlePresetClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD_PRESET);
  };
  return (
    <Container>
      <Flex>
        <PageTitle> Transactions </PageTitle>
        <Toggle
          onChange={() =>
            setView(view === "Transactions" ? "Preset" : "Transactions")
          }
          checked={view === "Preset"}
          label="View Presets"
        />
      </Flex>
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
          Add Preset Transaction
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
