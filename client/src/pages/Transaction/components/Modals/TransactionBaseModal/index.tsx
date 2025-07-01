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
import usePresetTransactionStore from "store/presetTransaction/presetTransactionStore";
import CategoryDropdown from "components/CategoryDropdown/CategoryDropdown";
import { getAccountBalanceByIdMap } from "store/account/accountSelectors";
import BalanceSummaryFooter from "components/BalanceSummaryFooter/BalanceSummaryFooter";
import useAccountStore from "store/account/accountStore";

type TransactionBaseModalProps = {
  title: string;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (transaction: RawTransaction, callback?: () => void) => void;
  isPresetModal?: boolean;
  initialTransaction?: Transaction;
};

export default function TransactionBaseModal({
  title,
  onClose,
  onSubmit,
  confirmText = "Add Transaction",
  isPresetModal,
  initialTransaction,
}: TransactionBaseModalProps) {
  const { presetTransactions } = usePresetTransactionStore();
  const { updateLocalAccountBalanceById } = useAccountStore();
  const userPreferences = getUserPreferences();
  const accountBalanceByIdMap = getAccountBalanceByIdMap();

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
      name: initialTransaction?.name,
      description: initialTransaction?.description,
      vendor: initialTransaction?.vendor,
      amount: initialTransaction?.amount,
      type: initialTransaction?.type,
      date: initialTransaction?.date || new Date().toISOString().split("T")[0],
      account:
        initialTransaction?.account?._id ||
        userPreferences?.defaultAccount?._id ||
        undefined,
      category: initialTransaction?.category,
      tags: initialTransaction?.tags || [],
    },
  });

  useEffect(() => {
    register("category", {
      required: isPresetModal ? false : "Category is required",
    });
    register("account", {
      required: isPresetModal ? false : "Account is required",
    });
  }, [register, isPresetModal]);

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

  const presetRenderer = (presetTransaction: PresetTransaction) => (
    <PresetTransactionMenuItem presetTransaction={presetTransaction} />
  );

  const presetToString = (presetTransaction: PresetTransaction) =>
    presetTransaction.name;

  const currentBalance = accountBalanceByIdMap[currentValues.account || ""];
  const afterBalance =
    currentBalance && currentValues.amount
      ? currentBalance +
        ((initialTransaction?.amount || 0) - currentValues.amount)
      : undefined;

  const onSubmitForm = async (data: RawTransaction) => {
    isPresetModal
      ? onSubmit(data)
      : onSubmit(data, () =>
          updateLocalAccountBalanceById(data.account, afterBalance || 0)
        );
    onClose();
  };

  return (
    <>
      <Title>{title}</Title>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        {!isPresetModal && (
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

        {isPresetModal && (
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
                required: isPresetModal ? false : "Vendor is required",
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
                required: isPresetModal ? false : "Amount is required",
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
                required: isPresetModal ? false : "Date is required",
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

        {!isPresetModal && (
          <BalanceSummaryFooter
            currentBalance={currentBalance}
            afterBalance={afterBalance}
          />
        )}
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
