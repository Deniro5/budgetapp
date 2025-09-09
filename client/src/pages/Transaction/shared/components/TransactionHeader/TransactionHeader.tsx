import styled from "styled-components";
import { BaseButton, Flex, PageTitle, SecondaryButton } from "styles";
import { COLORS, SPACING } from "theme";
import { faAdd, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionOverlayType } from "../../../transactions.types";
import useTransactionStore from "store/transaction/transactionStore";

const tabs = [
  { display: "Transactions", value: "Transactions" },
  { display: "Preset Transactions", value: "Preset" },
  { display: "Recurring Transactions", value: "Recurring" },
] as const;

export function TransactionHeader() {
  const { view, setView, setActiveOverlay } = useTransactionStore();
  const handleAddClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD);
  };

  const handleAddTransferClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD_TRANSFER);
  };

  const handleRecurringClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD_RECURRING);
  };

  const handlePresetClick = () => {
    setActiveOverlay(TransactionOverlayType.ADD_PRESET);
  };

  const renderButtons = () => {
    if (view === "Transactions") {
      return (
        <>
          <BaseButton onClick={handleAddClick}>
            <FontAwesomeIcon icon={faAdd} />
            Add Transaction{" "}
          </BaseButton>
          <BaseButton onClick={handleAddTransferClick}>
            <FontAwesomeIcon icon={faAdd} />
            Account Transfer
          </BaseButton>
        </>
      );
    } else if (view === "Preset") {
      return (
        <SecondaryButton onClick={handlePresetClick}>
          <FontAwesomeIcon icon={faFolderPlus} />
          Add Preset Transaction
        </SecondaryButton>
      );
    } else if (view === "Recurring") {
      return (
        <SecondaryButton onClick={handleRecurringClick}>
          <FontAwesomeIcon icon={faFolderPlus} />
          Add Recurring Transaction
        </SecondaryButton>
      );
    }
  };
  return (
    <Container>
      <Flex>
        <PageTitle> Transactions </PageTitle>
        <TabContainer>
          {tabs.map((tab) => (
            <Tab
              $isActive={tab.value === view}
              key={tab.value}
              onClick={() => setView(tab.value)}
            >
              {tab.display}
            </Tab>
          ))}
        </TabContainer>
      </Flex>
      <ButtonContainer>{renderButtons()}</ButtonContainer>
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

const TabContainer = styled(Flex)`
  gap: 2px;
`;

const Tab = styled.button<{ $isActive?: boolean }>`
  background: ${({ $isActive }) =>
    $isActive ? COLORS.primary : COLORS.pureWhite};
  border-radius: 4px;
  color: ${({ $isActive }) => ($isActive ? COLORS.pureWhite : COLORS.font)};
  border: 1px solid
    ${({ $isActive }) => ($isActive ? COLORS.primary : COLORS.darkGrey)};
  border: ${({ $isActive }) =>
    $isActive ? "" : `1px solid ${COLORS.darkGrey}`};
  padding: ${SPACING.spacing2x} ${SPACING.spacing4x};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  &:hover {
    background: ${COLORS.darkPrimary};
    color: ${COLORS.pureWhite};
  }
  gap: ${SPACING.spacing2x};
  cursor: pointer;
`;
