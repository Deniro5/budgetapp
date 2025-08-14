import styled from "styled-components";
import { BaseButton, Divider, InputContainer, InputLabel, Row } from "styles";
import { Account, AccountInvestmentSummaryItem } from "types/account";
import { COLORS, FONTSIZE, SPACING } from "theme";
import Modal from "components/Global/Modal";
import { formatTimestampToYYYYMMDD } from "../../../../utils/DateUtils";
import { formatToCurrency } from "utils";

type ViewAccountModalProps = {
  account: Account;
  onClose: () => void;
};

const InvestmentCard = (investment: AccountInvestmentSummaryItem) => {
  return (
    <Container key={investment.asset.symbol}>
      <NameContainer>
        <div>
          {investment.asset.name} ({investment.asset.symbol}){" "}
        </div>
      </NameContainer>
      <InfoContainer>
        <div>
          <b>Total Value:</b>{" "}
          {formatToCurrency(investment.quantity * investment.price)}
        </div>
        <div>
          <b>Price:</b> {formatToCurrency(investment.price)}
        </div>
        <div>
          <b>Quantity:</b> {investment.quantity}
        </div>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.spacing2x};
  border-bottom: 1px solid ${COLORS.mediumGrey};
  padding: ${SPACING.spacing4x} 0;
`;

const NameContainer = styled.div``;

const InfoContainer = styled.div`
  display: flex;
  gap: ${SPACING.spacing4x};
`;

export function ViewAccountModal({ account, onClose }: ViewAccountModalProps) {
  const handleClose = () => {
    onClose();
  };

  const assetTotal = account.investmentSummary.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <Modal isOpen={true} onClose={handleClose} width={600}>
      <Title>Account details</Title>
      <Row>
        <InputContainer>
          <InputLabel>Name</InputLabel>
          {account.name}
        </InputContainer>
        <InputContainer>
          <InputLabel>Balance</InputLabel>
          {formatToCurrency(account.balance)}
        </InputContainer>
        <InputContainer>
          <InputLabel>Baseline Date</InputLabel>
          {account.baselineDate}
        </InputContainer>
      </Row>

      <Row>
        <InputContainer>
          <InputLabel>Baseline Amount</InputLabel>
          {formatToCurrency(account.baselineAmount)}
        </InputContainer>

        <InputContainer>
          <InputLabel>Institution</InputLabel>
          {account.institution}
        </InputContainer>

        <InputContainer>
          <InputLabel>Type</InputLabel>
          {account.type}
        </InputContainer>
      </Row>
      <Row>
        <InputContainer>
          <InputLabel>Investment Total</InputLabel>${assetTotal}
        </InputContainer>
        <InputContainer>
          <InputLabel>Total Balance</InputLabel>
          {formatToCurrency(assetTotal + account.balance)}
        </InputContainer>
        <InputContainer>
          <InputLabel>Date Created</InputLabel>
          {formatTimestampToYYYYMMDD(account.createdAt)}
        </InputContainer>
      </Row>
      <Row>
        <InputContainer>
          <InputLabel>Investments</InputLabel>
          <InvestmentListContainer>
            {account.investmentSummary.map((investment) => (
              <InvestmentCard key={investment.asset.symbol} {...investment} />
            ))}
            {account.investmentSummary.length === 0 && "No Investments to show"}
          </InvestmentListContainer>
        </InputContainer>
      </Row>

      <ButtonContainer>
        <BaseButton onClick={handleClose}>Close Modal</BaseButton>
      </ButtonContainer>
    </Modal>
  );
}

const Title = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: ${SPACING.spacing6x};
  font-size: ${FONTSIZE.lg};
  color: ${COLORS.pureBlack};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;

const InvestmentListContainer = styled.div`
  max-height: 500px;
  overflow-y: scroll;

  /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Hide scrollbar for IE, Edge */
  -ms-overflow-style: none;
`;
