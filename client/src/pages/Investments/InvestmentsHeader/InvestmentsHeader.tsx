import styled from "styled-components";
import { BaseButton, PageTitle, SecondaryButton } from "styles";
import { SPACING } from "theme";
import { faAdd, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { InvestmentsOverlayType } from "../InvestmentsPage";

type TransactionHeaderProps = {
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<InvestmentsOverlayType | null>
  >;
};

export const InvestmentsHeader = ({
  setActiveOverlay,
}: TransactionHeaderProps) => {
  const handleAddClick = () => {
    setActiveOverlay(InvestmentsOverlayType.ADD);
  };

  const handleSellClick = () => {
    setActiveOverlay(InvestmentsOverlayType.SELL);
  };

  return (
    <Container>
      <PageTitle> Investments </PageTitle>
      <ButtonContainer>
        <BaseButton onClick={handleAddClick}>
          <FontAwesomeIcon icon={faAdd} />
          Add Investment
        </BaseButton>
        <SecondaryButton onClick={handleSellClick}>
          {" "}
          <FontAwesomeIcon icon={faMoneyBill} /> Sell Investment
        </SecondaryButton>
      </ButtonContainer>
    </Container>
  );
};

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
