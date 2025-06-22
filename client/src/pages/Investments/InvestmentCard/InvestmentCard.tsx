import {
  faAdd,
  faMoneyBill,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import {
  BaseButton,
  Card,
  DeleteButton,
  Divider,
  Flex,
  SecondaryButton,
} from "styles";
import { FONTSIZE, SPACING } from "theme";
import { Investment } from "types/investment";
import { InvestmentsOverlayType } from "../InvestmentsPage";
import { AssetChart } from "./AssetChart/AssetChart";

type InvestmentCardProps = {
  investment: Investment;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<InvestmentsOverlayType | null>
  >;
  setActiveInvestment: React.Dispatch<React.SetStateAction<Investment | null>>;
};

export function InvestmentCard({
  investment,
  setActiveOverlay,
  setActiveInvestment,
}: InvestmentCardProps) {
  const handleBuyClick = () => {
    setActiveOverlay(InvestmentsOverlayType.ADD);
    setActiveInvestment(investment);
  };

  const handleSellClick = () => {
    setActiveOverlay(InvestmentsOverlayType.SELL);
    setActiveInvestment(investment);
  };

  return (
    <Container>
      <InvestmentHeader>
        <InvestmentName>
          <SymbolText> {investment.asset.symbol} </SymbolText>-
          <NameText>{investment.asset.name}</NameText>
        </InvestmentName>
        <Price>${investment.price}</Price>
      </InvestmentHeader>
      <StyledDivider />
      <AssetChart />
      <StyledDivider />
      <InvestmentInfo>
        <Flex>
          <Label>Quantity: </Label>
          <Text>${investment.quantity} </Text>
        </Flex>
        <Flex>
          <Label>Average Cost: </Label>
          <Text> ${investment.price} </Text>
        </Flex>
        <Flex>
          <Label>Total Cost: </Label>
          <Text> ${investment.price * investment.quantity} </Text>
        </Flex>
        <Flex>
          <Label>Total Value: </Label>
          <Text>${investment.quantity * investment.price} </Text>
        </Flex>
        <Flex>
          <Label>Total Gain/Loss: </Label>
          <Text> ${investment.price * investment.quantity} </Text>
        </Flex>
      </InvestmentInfo>
      <ButtonContainer>
        <BaseButton onClick={handleBuyClick}>
          <FontAwesomeIcon icon={faAdd} />
          Buy more {investment.asset.symbol}
        </BaseButton>
        <SecondaryButton onClick={handleSellClick}>
          {" "}
          <FontAwesomeIcon icon={faMoneyBill} /> Sell {investment.asset.symbol}
        </SecondaryButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled(Card)`
  padding: ${SPACING.spacing6x};
  max-width: 750px;
`;

const StyledDivider = styled(Divider)`
  margin: ${SPACING.spacing4x} 0;
`;

const InvestmentInfo = styled(Flex)`
  flex-wrap: wrap;
  align-items: flex-start;

  margin-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing4x} ${SPACING.spacing10x};
  margin-left: ${SPACING.spacingBase};

  ${Flex} {
    gap: ${SPACING.spacing2x};
  }
`;

const Label = styled.h3`
  font-size: ${FONTSIZE.lg};
  font-weight: 600;

  margin: 0;
`;

const Text = styled.p`
  margin: 0;
`;

const InvestmentHeader = styled.div`
  margin: 0;
  font-size: ${FONTSIZE.ml};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${SPACING.spacing2x};
`;

const ButtonContainer = styled(Flex)`
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
`;

const InvestmentName = styled.div`
  margin: 0;
  font-size: ${FONTSIZE.ml};
  display: flex;
  align-items: center;
  gap: ${SPACING.spacing2x};
`;

const SymbolText = styled.span`
  font-size: ${FONTSIZE.ml};
  font-weight: 600;
`;

const NameText = styled.span`
  font-size: ${FONTSIZE.md};
  font-weight: 400;
  max-width: 250px;
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
`;

const Price = styled.h2`
  font-size: ${FONTSIZE.ml};
  font-weight: 600;
  margin: 0;
`;
