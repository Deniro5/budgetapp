import styled from "styled-components";
import {
  BaseButton,
  BaseInput,
  BaseSelect,
  InputContainer,
  InputLabel,
  SecondaryButton,
} from "../../../Styles";
import { COLORS, FONTSIZE, SPACING } from "../../../Theme";

type TransactionBaseModalProps = {
  title: string;
  showPresetNameField?: boolean;
  confirmText?: string;
  onClose: () => void;
};

export default function TransactionBaseModal({
  showPresetNameField,
  title,
  onClose,
  confirmText = "Add Transaction",
}: TransactionBaseModalProps) {
  return (
    <>
      <Title>{title}</Title>

      <Row>
        <InputContainer>
          <InputLabel>Prefill With Preset</InputLabel>
          <BaseSelect placeholder="Enter Name" required />
        </InputContainer>
      </Row>
      <Divider />

      {showPresetNameField && (
        <>
          <Row>
            <InputContainer>
              <InputLabel>Transaction Name</InputLabel>
              <BaseInput placeholder="Enter Name" required />
            </InputContainer>
          </Row>
          <Divider />
        </>
      )}

      <Row>
        <InputContainer>
          <InputLabel>Vendor*</InputLabel>
          <BaseInput placeholder="Enter vendor" required />
        </InputContainer>
        <InputContainer>
          <InputLabel>Amount</InputLabel>
          <BaseInput placeholder="Enter amount" />
        </InputContainer>
        <InputContainer>
          <InputLabel>Type</InputLabel>
          <BaseInput placeholder="Enter type" />
        </InputContainer>
      </Row>

      <Row>
        <InputContainer>
          <InputLabel>Date</InputLabel>
          <BaseInput placeholder="Enter date" />
        </InputContainer>
        <InputContainer>
          <InputLabel>Account</InputLabel>
          <BaseSelect>
            <option value="">Select account</option>
            <option value="account1">Account 1</option>
            <option value="account2">Account 2</option>
          </BaseSelect>
        </InputContainer>
        <InputContainer>
          <InputLabel>Category</InputLabel>
          <BaseSelect>
            <option value="">Select category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </BaseSelect>
        </InputContainer>
      </Row>

      <Divider />

      <Row>
        <InputContainer>
          <InputLabel>Frequency</InputLabel>
          <BaseSelect>
            <option value="">Select frequency</option>
            <option value="one-time">One-Time</option>
            <option value="recurring">Recurring</option>
          </BaseSelect>
        </InputContainer>
        <TagInputContainer>
          <InputLabel>Tags</InputLabel>
          <BaseInput type="text" placeholder="Enter tags" />
        </TagInputContainer>
      </Row>

      <ButtonContainer>
        <BaseButton onClick={onClose}>{confirmText}</BaseButton>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </ButtonContainer>
    </>
  );
}

const Title = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: ${SPACING.spacing6x};
  font-size: ${FONTSIZE.lg};
`;

const TagInputContainer = styled(InputContainer)`
  flex: 2 !important;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${SPACING.spacing4x};
  gap: 24px;

  ${InputContainer} {
    flex: 1;
  }
`;

const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid ${COLORS.mediumGrey};
  margin: ${SPACING.spacing4x} 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;
