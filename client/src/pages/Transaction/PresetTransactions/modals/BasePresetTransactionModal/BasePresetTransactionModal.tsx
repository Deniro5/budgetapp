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
  PresetTransaction,
  RawPresetTransaction,
} from "types/Transaction";
import AccountDropdown from "components/AccountDropdown/AccountDropdown";
import CategoryDropdown from "components/CategoryDropdown/CategoryDropdown";
import { COLORS, FONTSIZE, SPACING } from "theme";
import styled from "styled-components";
import { getUserPreferences } from "store/user/userSelectors";

type BasePresetTransactionModalProps =
  | {
      mode: "create";
      title: string;
      confirmText?: string;
      onClose: () => void;
      onSubmit: (transaction: RawPresetTransaction) => void;
      initialTransactions?: never;
    }
  | {
      mode: "edit";
      title: string;
      confirmText?: string;
      onClose: () => void;
      onSubmit: (transaction: Partial<RawPresetTransaction>) => void;
      initialTransactions: PresetTransaction[];
    };

export function BasePresetTransactionModal({
  mode,
  title,
  onClose,
  onSubmit,
  confirmText = mode === "edit" ? "Save Changes" : "Add Preset Transaction",
  initialTransactions = [],
}: BasePresetTransactionModalProps) {
  const isEditMode = mode === "edit";
  const firstTransaction = initialTransactions[0];

  const userPreferences = getUserPreferences();

  // Helper for default values
  function getDefaultValue<K extends keyof PresetTransaction>(field: K): any {
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
      (account) => account?.account?._id === firstTransaction?.account?._id
    )
      ? firstTransaction?.account?._id
      : undefined;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useForm<RawPresetTransaction>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: getDefaultValue("name"),
      description: getDefaultValue("description"),
      vendor: getDefaultValue("vendor"),
      amount: getDefaultValue("amount"),
      type: getDefaultValue("type"),
      date: getDefaultValue("date"),
      account: getDefaultAccountValue(),
      category: getDefaultValue("category"),
      tags: getDefaultValue("tags") || [],
    },
  });

  const currentValues = watch();

  const handleTagsChange = (tags: string[]) => setValue("tags", tags);
  const handleCategoryChange = (category: TransactionCategory) =>
    setValue("category", category, { shouldValidate: true, shouldDirty: true });
  const handleAccountChange = (accountId: string) =>
    setValue("account", accountId, { shouldValidate: true, shouldDirty: true });

  const onSubmitForm = (data: RawPresetTransaction) => {
    if (isEditMode) {
      const updates: Partial<RawPresetTransaction> = Object.keys(
        dirtyFields
      ).reduce((acc, key) => {
        const k = key as keyof RawPresetTransaction;
        acc[k] = data[k];
        return acc;
      }, {} as Partial<RawPresetTransaction>);
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
            <InputLabel>Preset Transaction Name</InputLabel>
            <BaseInput
              {...register("name", {
                required: isEditMode ? false : "Name is required",
                onChange: () => clearErrors("name"),
              })}
              placeholder="Enter Name"
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </InputContainer>
        </Row>

        <Divider />
        <SubTitle>Required Fields</SubTitle>
        <Row>
          <InputContainer>
            <InputLabel>Vendor</InputLabel>
            <BaseInput
              {...register("vendor", {
                required: false,
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
                required: false,
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
            <BaseInput type="date" {...register("date", { required: false })} />
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
              {...register("description", {
                required: false,
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
