import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Flex, IconButton } from "styles";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { Investment } from "types/investment";
import { formatToCurrency } from "utils";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type InvestmentHistoryItemProps = {
  investment: Investment;
  onClickDelete: (id: string) => void;
};

export const InvestmentHistoryItem = ({
  investment,
  onClickDelete,
}: InvestmentHistoryItemProps) => {
  const { quantity, price, date, asset, account } = investment;
  const isPurchase = quantity > 0;
  const actionText = isPurchase ? "Bought" : "Sold";
  const multiplier = isPurchase ? 1 : -1;

  return (
    <Container>
      <SubContainer>
        <MainText>
          {actionText} {multiplier * quantity} {asset.symbol}
        </MainText>
        <DateText>
          Date: {date} | Account: {account.name} | Price:{" "}
          {formatToCurrency(price)}
        </DateText>
      </SubContainer>
      <Flex>
        <MainText>{formatToCurrency(Math.abs(price * quantity))}</MainText>
        <IconButton onClick={() => onClickDelete(investment._id)}>
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      </Flex>
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
