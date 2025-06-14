import styled from "styled-components";
import {
  BaseButton,
  BaseInput,
  InputContainer,
  InputLabel,
  Row,
  SecondaryButton,
} from "styles";
import { useForm } from "react-hook-form";
import DropdownList from "components/DropdownList/DropdownList";

import { RawTransfer } from "types/Transaction";
import { getUserPreferences } from "store/user/userSelectors";
import { SPACING, FONTSIZE, COLORS } from "theme";

import { useEffect } from "react";

import {
  getAccountids,
  getAccountNameByIdMap,
} from "store/account/accountSelectors";

type TransferBaseModalProps = {
  title?: string;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (transaction: RawTransfer) => void;
  initialTransfer?: RawTransfer;
};

export default function TransferBaseModal({
  title = "Account Transfer",
  onClose,
  onSubmit,
  confirmText = "Confirm Transfer",
  initialTransfer,
}: TransferBaseModalProps) {
  const accountIds = getAccountids();
  const accountNameByIdMap = getAccountNameByIdMap();
  const userPreferences = getUserPreferences();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<RawTransfer>({
    mode: "onSubmit", // Validation only on submit
    reValidateMode: "onSubmit", // No revalidation on field changes
    defaultValues: initialTransfer || {
      sendingAccountId: userPreferences?.defaultAccount || undefined,
      receivingAccountId: undefined,
      amount: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  });

  console.log(initialTransfer);

  const receivingAccountId = watch("receivingAccountId");
  useEffect(() => {
    register("sendingAccountId", {
      required: "Sending account is required",
      validate: (value) =>
        value !== receivingAccountId || "Accounts cannot be the same",
    });
    register("receivingAccountId", {
      required: "Receiving account is required",
    });
  }, [register, receivingAccountId]);

  const currentValues = watch();

  const handleSendingAccountChange = (accountId: string) => {
    setValue("sendingAccountId", accountId, { shouldValidate: true });
  };

  const handleReceivingAccountChange = (accountId: string) => {
    setValue("receivingAccountId", accountId, { shouldValidate: true });
  };

  const onSubmitForm = (data: RawTransfer) => {
    onSubmit(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Title>{title}</Title>
      <>
        <SubTitle> Required Fields </SubTitle>
        <Row>
          <InputContainer>
            <InputLabel>Sending Account</InputLabel>
            <DropdownList
              items={accountIds}
              selected={currentValues.sendingAccountId}
              onSelect={handleSendingAccountChange}
              placeholder="Select Sending Account"
              itemToString={(item: string) => accountNameByIdMap[item]}
              searchable
            />
            {errors.sendingAccountId && (
              <ErrorMessage>{errors.sendingAccountId.message}</ErrorMessage>
            )}
          </InputContainer>
          <InputContainer>
            <InputLabel>Receiving Account</InputLabel>
            <DropdownList
              items={accountIds}
              selected={currentValues.receivingAccountId}
              onSelect={handleReceivingAccountChange}
              placeholder="Select Receiving Account"
              itemToString={(item: string) => accountNameByIdMap[item]}
              searchable
            />
            {errors.receivingAccountId && (
              <ErrorMessage>{errors.receivingAccountId.message}</ErrorMessage>
            )}
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
        </Row>
      </>
      <ButtonContainer>
        <BaseButton type="submit">{confirmText}</BaseButton>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </ButtonContainer>
    </form>
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
