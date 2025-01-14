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
import { RawTransaction, Transaction, TransactionType } from "../../types";
import { useState } from "react";
import TagInput from "../../../Global/TagInput";
import DropdownList from "../../../Global/DropdownList";
import { TRANSACTION_CATEGORIES } from "../../constants";
import { getUserTransactionCategories } from "../../../../zustand/user/userSelectors";

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
      type: TransactionType.EXPENSE,
      date: new Date().toISOString().split("T")[0],
      account: "",
      category: "",
      tags: [],
    }
  );

  const userTransactionCategories = getUserTransactionCategories();

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

  const handleTagsChange = (tags: string[]) => {
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      tags,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      category,
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
      <SubTitle> Required Fields </SubTitle>
      <Row>
        <InputContainer>
          <InputLabel>Vendor</InputLabel>
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
          <BaseSelect
            name="type"
            value={transaction.type}
            onChange={handleChange}
          >
            <option value={TransactionType.EXPENSE}>
              {TransactionType.EXPENSE}
            </option>
            <option value={TransactionType.INCOME}>
              {TransactionType.INCOME}
            </option>
          </BaseSelect>
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
          <DropdownList
            items={userTransactionCategories}
            selected={transaction.category}
            onSelect={handleCategoryChange}
            placeholder="Select Category"
            searchable
          />
        </InputContainer>
      </Row>

      <Divider />
      <SubTitle> Additional Fields </SubTitle>
      <Row>
        <InputContainer>
          <InputLabel>Frequency</InputLabel>
          <BaseSelect name="frequency" value={"dae"} onChange={handleChange}>
            <option value="">Select frequency</option>
            <option value="one-time">One-Time</option>
            <option value="recurring">Recurring</option>
          </BaseSelect>
        </InputContainer>
        <InputContainer>
          <InputLabel>Name</InputLabel>
          <BaseInput
            name="name"
            placeholder="Enter name"
            value={transaction.name}
            onChange={handleChange}
            required
          />
        </InputContainer>
      </Row>
      <Row>
        <TagInputContainer>
          <InputLabel>Tags</InputLabel>
          <TagInput
            selected={transaction.tags || []}
            onChange={handleTagsChange}
          />
        </TagInputContainer>
      </Row>
      <Row>
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
  color: ${COLORS.pureBlack};
`;

const SubTitle = styled.h3`
  text-align: left;
  margin-top: 0;
  margin-bottom: ${SPACING.spacing6x};
  font-size: ${FONTSIZE.md};
  color: ${COLORS.pureBlack};
`;

const TagInputContainer = styled(InputContainer)`
  max-width: 547px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;
