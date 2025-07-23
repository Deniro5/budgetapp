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
import TagInput from "components/Global/TagInput";

import {
  RawTransaction,
  Transaction,
  TransactionCategory,
  TransactionType,
  PresetTransaction,
} from "types/Transaction";
import { getUserPreferences } from "store/user/userSelectors";
import { SPACING, FONTSIZE, COLORS } from "theme";
import { useEffect, useState } from "react";
import PresetTransactionMenuItem from "./PresetTransactionMenuItem";
import AccountDropdown from "components/AccountDropdown/AccountDropdown";
import CategoryDropdown from "components/CategoryDropdown/CategoryDropdown";
import BalanceSummaryFooter from "components/BalanceSummaryFooter/BalanceSummaryFooter";
import { SearchDropdown } from "components/SearchDropdown/SearchDropdown";
import usePresetTransactionSearch from "../../hooks/usePresetTransactionList";
import useAccount from "../../../../Accounts/hooks/useAccount";

type BaseTransactionModalProps = {
  title: string;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (transaction: RawTransaction, callback?: () => void) => void;
  isPresetModal?: boolean;
  initialTransaction?: Transaction;
};

export function BaseTransactionModal({
  title,
  onClose,
  onSubmit,
  confirmText = "Add Transaction",
  initialTransaction,
}: BaseTransactionModalProps) {
  const [presetSearch, setPresetSearch] = useState("");

  const { presetTransactions } = usePresetTransactionSearch({
    search: presetSearch,
  });
  const userPreferences = getUserPreferences();

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
    defaultValues: {
      description: initialTransaction?.description,
      vendor: initialTransaction?.vendor,
      amount: initialTransaction?.amount,
      type: initialTransaction?.type,
      date: initialTransaction?.date,
      account:
        initialTransaction?.account?._id ||
        userPreferences?.defaultAccount?._id,
      category: initialTransaction?.category,
      tags: initialTransaction?.tags || [],
    },
  });
  const currentValues = watch();

  const { account } = useAccount(currentValues.account);

  useEffect(() => {
    register("category", {
      required: "Category is required",
    });
    register("account", {
      required: "Account is required",
    });
  }, [register]);

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
    reset({ ...currentValues, ...preset, account: preset.account?._id });
  };

  const presetRenderer = (presetTransaction: PresetTransaction) => (
    <PresetTransactionMenuItem presetTransaction={presetTransaction} />
  );

  const onSubmitForm = async (data: RawTransaction) => {
    onSubmit(data);
    onClose();
  };

  return (
    <>
      <Title>{title}</Title>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Row>
          <InputContainer>
            <InputLabel>Prefill With Preset</InputLabel>
            <SearchDropdown
              width={620}
              value={presetSearch}
              setValue={setPresetSearch}
              items={presetTransactions}
              placeholder="Search for preset transaction"
              selected={currentPreset}
              onSelect={function (item: PresetTransaction): void {
                handlePresetSelect(item);
              }}
              itemRenderer={presetRenderer}
              itemToString={({ name }) => `${name}`}
            />
          </InputContainer>
        </Row>
        <Divider />

        <SubTitle> Required Fields </SubTitle>
        <Row>
          <InputContainer>
            <InputLabel>Vendor</InputLabel>
            <BaseInput
              {...register("vendor", {
                required: "Vendor is required",
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
                required: "Amount is required",
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
                required: "Date is required",
                onChange: () => clearErrors("date"),
              })}
              type="date"
            />
            {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
          </InputContainer>
          <InputContainer>
            <InputLabel>Account</InputLabel>
            <AccountDropdown
              selectedAccountId={currentValues.account}
              handleAccountChange={handleAccountChange}
            />
            {errors.account && (
              <ErrorMessage>{errors.account.message}</ErrorMessage>
            )}
          </InputContainer>
          <InputContainer>
            <InputLabel>Category</InputLabel>
            <CategoryDropdown
              selectedCategory={currentValues.category}
              handleCategoryChange={handleCategoryChange}
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

        <BalanceSummaryFooter
          initialAccountId={initialTransaction?.account?._id}
          account={account}
          amount={currentValues.amount}
          initialAmount={initialTransaction?.amount}
          type={currentValues.type}
          initialType={initialTransaction?.type}
        />

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
