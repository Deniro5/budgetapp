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
  BatchEditTransaction,
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
import useAccount from "pages/Accounts/hooks/useAccount";

type BaseTransactionModalProps =
  | {
      mode: "create";
      title: string;
      confirmText?: string;
      onClose: () => void;
      onSubmit: (transaction: RawTransaction) => void;
      isPresetModal?: boolean;
      initialTransactions?: Transaction[];
      ignoreInitialAmount?: boolean;
    }
  | {
      mode: "edit";
      title: string;
      confirmText?: string;
      onClose: () => void;
      onSubmit: (transaction: BatchEditTransaction) => void;
      isPresetModal?: boolean;
      initialTransactions?: Transaction[];
      ignoreInitialAmount?: boolean;
    };

export function BaseTransactionModal({
  mode,
  title,
  onClose,
  onSubmit,
  confirmText = "Add Transaction",
  initialTransactions = [],
  ignoreInitialAmount,
}: BaseTransactionModalProps) {
  const isEditModal = mode === "edit";

  const [presetSearch, setPresetSearch] = useState("");

  const { presetTransactions } = usePresetTransactionSearch({
    search: presetSearch,
  });
  const userPreferences = getUserPreferences();

  const [currentPreset, setCurrentPreset] = useState<PresetTransaction | null>(
    null
  );

  const firstTransaction = initialTransactions[0];

  // string-like fields can return "Multiple Values"
  function getDefaultValue<K extends "description" | "vendor" | "date">(
    field: K
  ): string | undefined;

  // strict typed fields just return their actual type or undefined
  function getDefaultValue<
    K extends "amount" | "type" | "account" | "tags" | "category"
  >(field: K): Transaction[K] | undefined;

  // implementation
  function getDefaultValue<K extends keyof Transaction>(
    field: K
  ): Transaction[K] | string | undefined {
    if (!firstTransaction) return undefined;

    return initialTransactions.every(
      (t) => t[field] === firstTransaction[field]
    )
      ? firstTransaction[field]
      : typeof firstTransaction[field] === "string"
      ? "Multiple Values"
      : undefined;
  }

  function getDefaultAccountValue() {
    if (!firstTransaction) return userPreferences?.defaultAccount?._id;
    return initialTransactions.every(
      (account) => account.account._id === firstTransaction.account._id
    )
      ? firstTransaction.account._id
      : undefined;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<RawTransaction>({
    mode: "onSubmit", // Validation only on submit
    reValidateMode: "onSubmit", // No revalidation on field changes
    defaultValues: {
      description: getDefaultValue("description"),
      vendor: getDefaultValue("vendor"),
      date: getDefaultValue("date"),
      amount: getDefaultValue("amount"),
      type: getDefaultValue("type"),
      account: getDefaultAccountValue(),
      category: getDefaultValue("category"),
      tags: getDefaultValue("tags"),
    },
  });
  const currentValues = watch();

  const { account } = useAccount(currentValues.account);

  useEffect(() => {
    register("category", {
      required:
        isEditModal && !dirtyFields.category ? false : "Category is required",
    });
    register("account", {
      required:
        isEditModal && !dirtyFields.account ? false : "Account is required",
    });
  }, [register, dirtyFields.category, dirtyFields.account, isEditModal]);

  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags);
  };

  const handleCategoryChange = (category: TransactionCategory) => {
    setValue("category", category, { shouldValidate: true, shouldDirty: true });
  };

  const handleAccountChange = (accountId: string) => {
    setValue("account", accountId, { shouldValidate: true, shouldDirty: true });
  };

  const handlePresetSelect = (preset: PresetTransaction) => {
    setCurrentPreset(preset);
    reset({ ...currentValues, ...preset, account: preset.account?._id });
  };

  const presetRenderer = (presetTransaction: PresetTransaction) => (
    <PresetTransactionMenuItem presetTransaction={presetTransaction} />
  );

  const onSubmitForm = async (data: RawTransaction) => {
    if (isEditModal) {
      const updates: BatchEditTransaction = Object.keys(dirtyFields).reduce(
        (acc, key) => {
          const k = key as keyof BatchEditTransaction;
          acc[k] = data[k as keyof RawTransaction] as any; // 'as any' only if TS complains about value types
          return acc;
        },
        {} as BatchEditTransaction
      );
      onSubmit(updates);
    } else {
      onSubmit(data);
    }
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
                required:
                  isEditModal && !dirtyFields.vendor
                    ? false
                    : "Vendor is required",
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
                required:
                  isEditModal && !dirtyFields.amount
                    ? false
                    : "Amount is required",
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
                required:
                  isEditModal && !dirtyFields.date ? false : "Date is required",
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

        {initialTransactions?.length <= 1 && (
          <BalanceSummaryFooter
            initialAccountId={firstTransaction?.account?._id}
            account={account}
            amount={currentValues.amount}
            initialAmount={ignoreInitialAmount ? 0 : firstTransaction?.amount}
            type={currentValues.type}
            initialType={firstTransaction?.type}
          />
        )}

        <ButtonContainer>
          <BaseButton type="submit">{confirmText}</BaseButton>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
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
