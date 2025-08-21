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
  TransactionCategory,
  TransactionType,
  RecurringTransaction,
  RawRecurringTransaction,
  RecurringTransactionInterval,
} from "types/Transaction";
import { SPACING, FONTSIZE, COLORS } from "theme";
import AccountDropdown from "components/AccountDropdown/AccountDropdown";
import CategoryDropdown from "components/CategoryDropdown/CategoryDropdown";
import { capitalize } from "lodash";

type BaseRecurringTransactionModalProps =
  | {
      mode: "create";
      title: string;
      confirmText?: string;
      onClose: () => void;
      onSubmit: (transaction: RawRecurringTransaction) => void;
      initialTransactions?: never;
    }
  | {
      mode: "edit";
      title: string;
      confirmText?: string;
      onClose: () => void;
      onSubmit: (transaction: Partial<RawRecurringTransaction>) => void;
      initialTransactions: RecurringTransaction[];
    };

export function BaseRecurringTransactionModal({
  mode,
  title,
  onClose,
  onSubmit,
  confirmText = mode === "edit" ? "Save Changes" : "Add Recurring Transaction",
  initialTransactions = [],
}: BaseRecurringTransactionModalProps) {
  const isEditMode = mode === "edit";
  const firstTransaction = initialTransactions[0];
  function getDefaultValue<K extends keyof RecurringTransaction>(
    field: K
  ): RecurringTransaction[K] | undefined {
    if (!firstTransaction) return undefined;

    const allSame = initialTransactions.every(
      (t) => t[field] === firstTransaction[field]
    );

    if (allSame) return firstTransaction[field];

    // Only string fields can show "Multiple Values"
    const fieldValue = firstTransaction[field];
    if (typeof fieldValue === "string") {
      return "Multiple Values" as RecurringTransaction[K];
    }

    // For number, enum, or array types, fallback to undefined
    return undefined;
  }

  function getDefaultAccountValue() {
    if (!firstTransaction) return undefined;
    const allSame = initialTransactions.every(
      (t) => t.account?._id === firstTransaction.account?._id
    );
    return allSame ? firstTransaction.account?._id : undefined;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useForm<RawRecurringTransaction>({
    mode: "onSubmit",
    defaultValues: {
      vendor: getDefaultValue("vendor"),
      amount: getDefaultValue("amount"),
      type: getDefaultValue("type"),
      date: getDefaultValue("date"),
      account: getDefaultAccountValue(),
      category: getDefaultValue("category"),
      interval: getDefaultValue("interval"),
      tags: getDefaultValue("tags") || [],
      description: getDefaultValue("description"),
      name: getDefaultValue("name"),
    },
  });

  const currentValues = watch();

  const handleTagsChange = (tags: string[]) => setValue("tags", tags);
  const handleCategoryChange = (category: TransactionCategory) =>
    setValue("category", category, { shouldValidate: true, shouldDirty: true });
  const handleAccountChange = (accountId: string) =>
    setValue("account", accountId, { shouldValidate: true, shouldDirty: true });

  const onSubmitForm = (data: RawRecurringTransaction) => {
    if (isEditMode) {
      const updates: Partial<RawRecurringTransaction> = Object.keys(
        dirtyFields
      ).reduce((acc, key) => {
        const k = key as keyof RawRecurringTransaction;
        acc[k] = data[k];
        return acc;
      }, {} as Partial<RawRecurringTransaction>);
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
        <SubTitle>Required Fields</SubTitle>
        <Row>
          <InputContainer>
            <InputLabel>Vendor</InputLabel>
            <BaseInput
              {...register("vendor", {
                required: isEditMode ? false : "Vendor is required",
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
                required: isEditMode ? false : "Amount is required",
                validate: (value) => !isNaN(value || 0) || "Invalid number",
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
            <BaseSelect
              {...register("type", {
                required: isEditMode ? false : "Type is required",
              })}
            >
              <option value={TransactionType.EXPENSE}>Expense</option>
              <option value={TransactionType.INCOME}>Income</option>
            </BaseSelect>
            {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
          </InputContainer>
        </Row>

        <Row>
          <InputContainer>
            <InputLabel>Initial Date</InputLabel>
            <BaseInput
              {...register("date", {
                required: isEditMode ? false : "Date is required",
              })}
              type="date"
            />
            {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <InputLabel>Account</InputLabel>
            <AccountDropdown
              selectedAccountId={currentValues.account ?? null}
              handleAccountChange={handleAccountChange}
            />
            {errors.account && (
              <ErrorMessage>{errors.account.message}</ErrorMessage>
            )}
          </InputContainer>

          <InputContainer>
            <InputLabel>Category</InputLabel>
            <CategoryDropdown
              selectedCategory={currentValues.category ?? null}
              handleCategoryChange={handleCategoryChange}
            />
            {errors.category && (
              <ErrorMessage>{errors.category.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>

        <Row>
          <InputContainer>
            <InputLabel>Frequency</InputLabel>
            <BaseSelect
              {...register("interval", {
                required: isEditMode ? false : "Interval is required",
              })}
            >
              {Object.values(RecurringTransactionInterval).map((value) => (
                <option key={value} value={value}>
                  {capitalize(value)}
                </option>
              ))}
            </BaseSelect>
            {errors.interval && (
              <ErrorMessage>{errors.interval.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>

        <Divider />
        <SubTitle>Additional Fields</SubTitle>

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
              {...register("description")}
              placeholder="Enter description"
            />
          </InputContainer>
        </Row>

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
