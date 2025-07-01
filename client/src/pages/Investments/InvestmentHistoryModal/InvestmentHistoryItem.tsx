import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { Investment } from "types/investment";

type InvestmentHistoryItemProps = {
  investment: Investment;
};

export const InvestmentHistoryItem = ({
  investment,
}: InvestmentHistoryItemProps) => {
  const { quantity, price, date, asset, account } = investment;
  const actionText = quantity > 0 ? "Bought" : "Sold";

  return (
    <Container>
      <SubContainer>
        <MainText>
          {actionText} {quantity} {asset.symbol}
        </MainText>
        <DateText>
          {" "}
          Date: {date} | Account: {account}
        </DateText>
      </SubContainer>

      <MainText>${Math.abs(price * quantity)}</MainText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING.spacing4x} ${SPACING.spacing6x};
  border-bottom: 1px solid ${COLORS.lightGrey};
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.spacing2x};
`;

const MainText = styled.p`
  font-weight: 600;
  font-size: ${FONTSIZE.lg};
  margin: 0;
`;

const DateText = styled.p`
  font-size: ${FONTSIZE.sm};
  margin: 0;
`;
