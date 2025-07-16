import styled from "styled-components";
import {
  BaseButton,
  BaseInput,
  BaseSelect,
  InputContainer,
  InputLabel,
  Row,
  SecondaryButton,
} from "styles";
import { useForm } from "react-hook-form";

import { Account, AccountType } from "types/account";
import { COLORS, FONTSIZE, SPACING } from "theme";

type BaseAccountModalProps = {
  title: string;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (account: Account) => void;
  initialAccount?: Account;
};

export function BaseAccountModal({
  title,
  onClose,
  onSubmit,
  confirmText = "Add Account",
  initialAccount,
}: BaseAccountModalProps) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<Account>({
    mode: "onSubmit", // Validation only on submit
    reValidateMode: "onSubmit", // No revalidation on field changes
    defaultValues: initialAccount || {
      name: "",
      baselineAmount: 0,
      baselineDate: new Date().toISOString().split("T")[0],
      institution: "",
      type: undefined,
    },
  });

  const onSubmitForm = (data: Account) => {
    onSubmit(data);
    onClose();
  };

  return (
    <>
      <Title>{title}</Title>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Row>
          <InputContainer>
            <InputLabel>Name</InputLabel>
            <BaseInput
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[a-zA-Z0-9 ]*$/,
                  message: "Alphanumeric values only",
                },
                onChange: () => clearErrors("name"),
              })}
              placeholder="Enter name"
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </InputContainer>
        </Row>
        <Row>
          <InputContainer>
            <InputLabel>Baseline Amount</InputLabel>
            <BaseInput
              {...register("baselineAmount", {
                required: "Baseline Amount is required",
                validate: (value) => !isNaN(value) || "Invalid number",
                onChange: () => clearErrors("baselineAmount"),
              })}
              placeholder="Enter baseline"
            />
            {errors.baselineAmount && (
              <ErrorMessage>{errors.baselineAmount.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>
        <Row>
          <InputContainer>
            <InputLabel>Baseline Date</InputLabel>
            <BaseInput
              {...register("baselineDate", {
                required: "Baseline date is required",
                onChange: () => clearErrors("baselineDate"),
              })}
              type="date"
            />
            {errors.baselineDate && (
              <ErrorMessage>{errors.baselineDate.message}</ErrorMessage>
            )}
          </InputContainer>{" "}
        </Row>
        <Row>
          <InputContainer>
            <InputLabel>Institution</InputLabel>
            <BaseInput
              {...register("institution", {
                required: "Institution is required",
                pattern: {
                  value: /^[a-zA-Z0-9 ]*$/,
                  message: "Alphanumeric values only",
                },
                onChange: () => clearErrors("institution"),
              })}
              placeholder="Enter institution"
            />
            {errors.institution && (
              <ErrorMessage>{errors.institution.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>

        <Row>
          <InputContainer>
            <InputLabel>Type</InputLabel>
            <BaseSelect {...register("type")}>
              {Object.values(AccountType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </BaseSelect>
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
