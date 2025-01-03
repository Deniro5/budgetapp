import styled from "styled-components";
import {
  BaseButton,
  BaseInput,
  BaseSelect,
  Divider,
  InputContainer,
  InputLabel,
  Row,
  SecondaryButton,
} from "../../../../Styles";
import { COLORS, FONTSIZE, SPACING } from "../../../../Theme";
import { RawTransaction, Transaction } from "../../../../types/transaction";
import { useState } from "react";

type TransactionBaseModalProps = {
  title: string;
  showPresetNameField?: boolean;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (transaction: RawTransaction) => void;
  initialTransaction?: RawTransaction | null;
};

export default function TransactionBaseModal({
  showPresetNameField,
  title,
  onClose,
  onSubmit,
  confirmText = "Add Transaction",
  initialTransaction,
}: TransactionBaseModalProps) {
  const [transaction, setTransaction] = useState<RawTransaction>(
    initialTransaction || {
      name: "",
      description: "",
      vendor: "",
      amount: 0.0,
      type: "",
      date: "",
      account: "",
      category: "",
    }
  );

  // Update form state when inputs change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit(transaction);
    onClose();
  };

  return (
    <>
      <Title>{title}</Title>

      <Row>
        <InputContainer>
          <InputLabel>Prefill With Preset</InputLabel>
          <BaseSelect
            name="preset"
            placeholder="Enter Name"
            onChange={handleChange}
          >
            <option value="">Select preset</option>
            {/* Add preset options dynamically */}
          </BaseSelect>
        </InputContainer>
      </Row>
      <Divider />

      {showPresetNameField && (
        <>
          <Row>
            <InputContainer>
              <InputLabel>Transaction Name</InputLabel>
              <BaseInput
                name="transactionName"
                placeholder="Enter Name"
                value={transaction.name}
                onChange={handleChange}
                required
              />
            </InputContainer>
          </Row>
          <Divider />
        </>
      )}

      <Row>
        <InputContainer>
          <InputLabel>Name*</InputLabel>
          <BaseInput
            name="name"
            placeholder="Enter name"
            value={transaction.name}
            onChange={handleChange}
            required
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>Description</InputLabel>
          <BaseInput
            name="description"
            placeholder="Enter description"
            value={transaction.description}
            onChange={handleChange}
          />
        </InputContainer>
      </Row>

      <Row>
        <InputContainer>
          <InputLabel>Vendor*</InputLabel>
          <BaseInput
            name="vendor"
            placeholder="Enter vendor"
            value={transaction.vendor}
            onChange={handleChange}
            required
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>Amount</InputLabel>
          <BaseInput
            name="amount"
            placeholder="Enter amount"
            type="number"
            value={transaction.amount}
            onChange={handleChange}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>Type</InputLabel>
          <BaseInput
            name="type"
            placeholder="Enter type"
            value={transaction.type}
            onChange={handleChange}
          />
        </InputContainer>
      </Row>

      <Row>
        <InputContainer>
          <InputLabel>Date</InputLabel>
          <BaseInput
            name="date"
            placeholder="Enter date"
            type="date"
            value={transaction.date}
            onChange={handleChange}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>Account</InputLabel>
          <BaseSelect
            name="account"
            value={transaction.account}
            onChange={handleChange}
          >
            <option value="">Select account</option>
            <option value="account1">Account 1</option>
            <option value="account2">Account 2</option>
          </BaseSelect>
        </InputContainer>
        <InputContainer>
          <InputLabel>Category</InputLabel>
          <BaseSelect
            name="category"
            value={transaction.category}
            onChange={handleChange}
          >
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
          <BaseSelect name="frequency" value={"dae"} onChange={handleChange}>
            <option value="">Select frequency</option>
            <option value="one-time">One-Time</option>
            <option value="recurring">Recurring</option>
          </BaseSelect>
        </InputContainer>
        <TagInputContainer>
          <InputLabel>Tags</InputLabel>
          <BaseInput
            name="tags"
            placeholder="Enter tags"
            value={[]}
            onChange={handleChange}
          />
        </TagInputContainer>
      </Row>

      <ButtonContainer>
        <BaseButton onClick={handleSubmit}>{confirmText}</BaseButton>
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;
