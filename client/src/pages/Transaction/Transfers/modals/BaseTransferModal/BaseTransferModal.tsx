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

import { RawTransfer, TransactionType } from "types/Transaction";
import { getUserPreferences } from "store/user/userSelectors";
import { SPACING, FONTSIZE, COLORS } from "theme";

import { useEffect } from "react";

import AccountDropdown from "components/AccountDropdown/AccountDropdown";
import BalanceSummaryFooter from "components/BalanceSummaryFooter/BalanceSummaryFooter";
import useAccount from "../../../../Accounts/hooks/useAccount";

type BaseTransferModalProps = {
  title?: string;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (transaction: RawTransfer) => void;
  initialTransfer?: RawTransfer;
};

export function BaseTransferModal({
  title = "Account Transfer",
  onClose,
  onSubmit,
  confirmText = "Confirm Transfer",
  initialTransfer,
}: BaseTransferModalProps) {
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
      sendingAccountId: userPreferences?.defaultAccount?._id || undefined,
      receivingAccountId: undefined,
      amount: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const { receivingAccountId, sendingAccountId, amount } = watch();
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

  const { account: receivingAccount } = useAccount(receivingAccountId);
  const { account: sendingAccount } = useAccount(sendingAccountId);

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

  const parsedAmount = Number(amount);

  const currentReceivingBalance = receivingAccount?.balance;
  const afterReceivingBalance =
    currentReceivingBalance && amount
      ? currentReceivingBalance +
        ((initialTransfer?.amount ?? 0) + parsedAmount)
      : undefined;

  const currentSendingBalance = sendingAccount?.balance;
  currentSendingBalance && amount
    ? currentSendingBalance + ((initialTransfer?.amount ?? 0) - parsedAmount)
    : undefined;
  const afterSendingBalance =
    currentSendingBalance && amount
      ? currentSendingBalance + ((initialTransfer?.amount ?? 0) - parsedAmount)
      : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Title>{title}</Title>
      <>
        <Row>
          <InputContainer>
            <InputLabel>Sending Account</InputLabel>
            <AccountDropdown
              selectedAccountId={sendingAccountId}
              handleAccountChange={handleSendingAccountChange}
              placeholder="Select Sending Account"
            />

            {errors.sendingAccountId && (
              <ErrorMessage>{errors.sendingAccountId.message}</ErrorMessage>
            )}
          </InputContainer>
          <InputContainer>
            <InputLabel>Receiving Account</InputLabel>
            <AccountDropdown
              selectedAccountId={receivingAccountId}
              handleAccountChange={handleReceivingAccountChange}
              placeholder="Select Receiving Account"
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
      <BalanceSummaryLabel>
        Receiving Account{" "}
        {receivingAccount?.name ? `(${receivingAccount.name})` : ""}:
      </BalanceSummaryLabel>
      <BalanceSummaryFooter
        initialAccountId={initialTransfer?.receivingAccountId}
        account={receivingAccount}
        initialAmount={initialTransfer?.amount}
        initialType={initialTransfer ? TransactionType.INCOME : undefined}
        amount={parsedAmount}
        type={TransactionType.INCOME}
      />
      <BalanceSummaryLabel>
        Sending Account {sendingAccount?.name ? `(${sendingAccount.name})` : ""}
        :
      </BalanceSummaryLabel>
      <BalanceSummaryFooter
        initialAccountId={initialTransfer?.sendingAccountId}
        account={sendingAccount}
        initialAmount={initialTransfer?.amount}
        initialType={initialTransfer ? TransactionType.EXPENSE : undefined}
        amount={parsedAmount}
        type={TransactionType.EXPENSE}
      />
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

const BalanceSummaryLabel = styled.h3`
  text-align: left;
  margin-top: ${SPACING.spacing4x};
  margin-bottom: ${SPACING.spacing2x};
  font-size: ${FONTSIZE.md};
  color: ${COLORS.pureBlack};
  font-weight: 500;
`;
