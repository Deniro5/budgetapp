import styled from "styled-components";
import { BaseButton, InputContainer, InputLabel, Row } from "styles";
import { Account } from "types/account";
import { COLORS, FONTSIZE, SPACING } from "theme";
import Modal from "components/Global/Modal";

type ViewAccountModalProps = {
  account: Account;
  onClose: () => void;
};

export function ViewAccountModal({ account, onClose }: ViewAccountModalProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={handleClose} width={500}>
      <Title>Account details</Title>
      <Row>
        <InputContainer>
          <InputLabel>Name</InputLabel>
          {account.name}
        </InputContainer>
        <InputContainer>
          <InputLabel>Balance</InputLabel>
          {account.balance}
        </InputContainer>
        <InputContainer>
          <InputLabel>Baseline Date</InputLabel>
          {account.baselineDate}
        </InputContainer>
      </Row>

      <Row>
        <InputContainer>
          <InputLabel>Baseline Amount</InputLabel>
          {account.baselineAmount}
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
          <InputLabel>Investments</InputLabel>
          {account.investmentSummary.map((investment) => (
            <div key={investment.asset.symbol}>
              <div>{investment.asset.name}</div>
              <div>{investment.quantity}</div>
              <div>{investment.price}</div>
            </div>
          ))}
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
