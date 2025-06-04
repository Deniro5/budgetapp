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
} from "styles";
import { useForm } from "react-hook-form";
import DropdownList from "components/DropdownList/DropdownList";
import TagInput from "components/Global/TagInput";

import {
  RawTransaction,
  TransactionCategory,
  TransactionType,
} from "types/Transaction";
import {
  getUserPreferences,
  getUserTransactionCategories,
} from "store/user/userSelectors";
import { SPACING, FONTSIZE, COLORS } from "theme";
import { getPresetTransactions } from "store/presetTransaction/presetTransactionSelectors";
import { PresetTransaction } from "types/presetTransaction";
import { useEffect, useState } from "react";
import PresetTransactionMenuItem from "./PresetTransactionMenuItem";
import { transactionCategoryNameMap } from "constants/transactionCategoryNameMap";

import {
  getAccountids,
  getAccountNameByIdMap,
} from "store/account/accountSelectors";

type TransactionBaseModalProps = {
  title: string;
  showPresetNameField?: boolean;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (transaction: RawTransaction) => void;
  initialTransaction?: RawTransaction | null;
  disableValidation?: boolean; //disable required validation
};

export default function TransactionBaseModal({
  showPresetNameField,
  title,
  onClose,
  onSubmit,
  confirmText = "Add Transaction",
  initialTransaction,
  disableValidation,
}: TransactionBaseModalProps) {
  const accountIds = getAccountids();
  const accountNameByIdMap = getAccountNameByIdMap();
  const userPreferences = getUserPreferences();
  const userTransactionCategories = getUserTransactionCategories();
  const presetTransactions = getPresetTransactions();
  const [currentPreset, setCurrentPreset] = useState<PresetTransaction | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    reset,

    formState: { errors },
  } = useForm<RawTransaction>({
    mode: "onSubmit", // Validation only on submit
    reValidateMode: "onSubmit", // No revalidation on field changes
    defaultValues: initialTransaction || {
      name: "",
      description: "",
      vendor: "",
      amount: undefined,
      type: undefined,
      date: new Date().toISOString().split("T")[0],
      account: userPreferences?.defaultAccount || undefined,
      category: undefined,
      tags: [],
    },
  });

  useEffect(() => {
    register("category", {
      required: disableValidation ? false : "Category is required",
    });
    register("account", {
      required: disableValidation ? false : "Account is required",
    });
  }, [register, disableValidation]);

  const currentValues = watch();

  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags);
  };

  const handleCategoryChange = (category: TransactionCategory) => {
    setValue("category", category, { shouldValidate: true });
  };

  const handleAccountChange = (accountId: string) => {
    setValue("account", accountId, { shouldValidate: true });
  };

  const handlePresetSelect = (preset: PresetTransaction) => {
    setCurrentPreset(preset);
    reset({ ...currentValues, ...preset });
  };

  const onSubmitForm = (data: RawTransaction) => {
    onSubmit(data);
    onClose();
  };

  const presetRenderer = (presetTransaction: PresetTransaction) => (
    <PresetTransactionMenuItem presetTransaction={presetTransaction} />
  );

  const presetToString = (presetTransaction: PresetTransaction) =>
    presetTransaction.name;

  console.log(userPreferences);
  return (
    <>
      <Title>{title}</Title>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        {!showPresetNameField && (
          <>
            <Row>
              <InputContainer>
                <InputLabel>Prefill With Preset</InputLabel>
                <DropdownList
                  items={presetTransactions}
                  itemRenderer={presetRenderer}
                  selected={currentPreset}
                  onSelect={handlePresetSelect}
                  itemToString={presetToString}
                  placeholder="Select Preset"
                  searchable
                  width={620}
                />
              </InputContainer>
            </Row>
            <Divider />
          </>
        )}

        {showPresetNameField && (
          <>
            <Row>
              <InputContainer>
                <InputLabel>Preset Transaction Name</InputLabel>
                <BaseInput
                  {...register("name", {
                    required: "Name is required",
                    onChange: () => clearErrors("name"),
                  })}
                  placeholder="Enter Name"
                />
                {errors.name && (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
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
              {...register("vendor", {
                required: disableValidation ? false : "Vendor is required",
                pattern: {
                  value: /^[a-zA-Z0-9 ]*$/,
                  message: "Alphanumeric values only",
                },
                onChange: () => clearErrors("vendor"),
              })}
              placeholder="Enter vendor"
            />
            {errors.vendor && (
              <ErrorMessage>{errors.vendor.message}</ErrorMessage>
            )}
          </InputContainer>
          <InputContainer>
            <InputLabel>Amount</InputLabel>
            <BaseInput
              {...register("amount", {
                required: disableValidation ? false : "Amount is required",
                validate: (value) => !isNaN(value) || "Invalid number",
                onChange: () => clearErrors("amount"),
              })}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <ErrorMessage>{errors.amount.message}</ErrorMessage>
            )}
          </InputContainer>
          <InputContainer>
            <InputLabel>Type</InputLabel>
            <BaseSelect {...register("type")}>
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
              {...register("date", {
                required: disableValidation ? false : "Date is required",
                onChange: () => clearErrors("date"),
              })}
              type="date"
            />
            {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
          </InputContainer>
          <InputContainer>
            <InputLabel>Account</InputLabel>
            <DropdownList
              items={accountIds}
              selected={currentValues.account}
              onSelect={handleAccountChange}
              placeholder="Select Account"
              itemToString={(item: string) => accountNameByIdMap[item]}
              searchable
            />
            {errors.account && (
              <ErrorMessage>{errors.account.message}</ErrorMessage>
            )}
          </InputContainer>
          <InputContainer>
            <InputLabel>Category</InputLabel>
            <DropdownList
              items={userTransactionCategories}
              selected={currentValues.category}
              onSelect={handleCategoryChange}
              placeholder="Select Category"
              itemToString={(item: TransactionCategory) =>
                transactionCategoryNameMap[item]
              }
              searchable
            />
            {errors.category && (
              <ErrorMessage>{errors.category.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>

        <Divider />
        <SubTitle> Additional Fields </SubTitle>
        <Row>
          <InputContainer>
            <InputLabel>Frequency</InputLabel>
            <BaseSelect>
              <option value="">Select frequency</option>
              <option value="one-time">One-Time</option>
              <option value="recurring">Recurring</option>
            </BaseSelect>
          </InputContainer>
        </Row>
        <Row>
          <TagInputContainer>
            <InputLabel>Tags</InputLabel>
            <TagInput
              value={currentValues.tags || []}
              setValue={handleTagsChange}
            />
          </TagInputContainer>
        </Row>
        <Row>
          <InputContainer>
            <InputLabel>Description</InputLabel>
            <BaseInput
              {...register("description", {
                pattern: {
                  value: /^[a-zA-Z0-9 .,!?;:'"()-]*$/,
                  message: "No special characters are allowed",
                },
                onChange: () => clearErrors("description"),
              })}
              placeholder="Enter description"
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>

        <ButtonContainer>
          <BaseButton type="submit">{confirmText}</BaseButton>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        </ButtonContainer>
      </form>
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

const TagInputContainer = styled(InputContainer)``;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;

const ErrorMessage = styled.p`
  margin: 0 ${SPACING.spacing2x};
  color: ${COLORS.deleteRed};
  font-size: ${FONTSIZE.sm};
`;
