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

import { getUserPreferences } from "store/user/userSelectors";
import { SPACING, FONTSIZE, COLORS } from "theme";
import { useEffect, useState } from "react";

import AccountDropdown from "components/AccountDropdown/AccountDropdown";

import Modal from "components/Global/Modal";
import { InvestmentSearchResult, RawInvestment } from "types/investment";
import { SearchDropdown } from "components/SearchDropdown/SearchDropdown";
import { useInvestmentSearch } from "../hooks/useInvestmentSearch";
import InvestmentSearchResultMenuItem from "./InvestmentSearchResultMenuItem";

type AddInvestmentModalProps = {
  onClose: () => void;
  onSubmit: (investment: RawInvestment) => void;
};

const investmentSearchResultRenderer = (
  investmentSearchResult: InvestmentSearchResult
) => (
  <InvestmentSearchResultMenuItem
    investmentSearchResult={investmentSearchResult}
  />
);

export default function AddInvestmentModal({
  onClose,
  onSubmit,
}: AddInvestmentModalProps) {
  const { results, input, setInput } = useInvestmentSearch();
  const [selectedInvestment, setSelectedInvestment] =
    useState<InvestmentSearchResult | null>(null);
  const userPreferences = getUserPreferences();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<RawInvestment>({
    mode: "onSubmit", // Validation only on submit
    reValidateMode: "onSubmit", // No revalidation on field changes
    defaultValues: {
      symbol: undefined,
      quantity: 0,
      price: 0,
      date: new Date().toISOString().split("T")[0],
      account: userPreferences?.defaultAccount?._id,
    },
  });

  useEffect(() => {
    register("account", {
      required: "Account is required",
    });
  }, [register]);

  const currentValues = watch();

  const handleAccountChange = (accountId: string) => {
    setValue("account", accountId, { shouldValidate: true });
  };

  const onSubmitForm = (data: RawInvestment) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <Title>Add Investment</Title>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <SubTitle> Required Fields </SubTitle>
        <Row>
          <InputContainer>
            <InputLabel>Symbol</InputLabel>
            <SearchDropdown
              width={600}
              value={input}
              setValue={setInput}
              items={results}
              placeholder="Enter symbol"
              selected={selectedInvestment}
              onSelect={function (item: InvestmentSearchResult): void {
                setSelectedInvestment(item);
              }}
              itemRenderer={investmentSearchResultRenderer}
              itemToString={(item: InvestmentSearchResult) => item?.symbol}
            />
          </InputContainer>
        </Row>
        <Row>
          <InputContainer>
            <InputLabel>Amount</InputLabel>
            <BaseInput
              {...register("quantity", {
                required: "Quantity is required",
                validate: (value) => !isNaN(value) || "Invalid number",
                onChange: () => clearErrors("quantity"),
              })}
              placeholder="Enter amount"
            />
            {errors.quantity && (
              <ErrorMessage>{errors.quantity.message}</ErrorMessage>
            )}
          </InputContainer>
          <InputContainer>
            <InputLabel>Price</InputLabel>
            <BaseInput
              {...register("price", {
                required: "Price is required",
                validate: (value) => !isNaN(value) || "Invalid number",
                onChange: () => clearErrors("price"),
              })}
              placeholder="Enter amount"
            />
            {errors.price && (
              <ErrorMessage>{errors.price.message}</ErrorMessage>
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
            <InputLabel>Account</InputLabel>
            <AccountDropdown
              selectedAccountId={currentValues.account}
              handleAccountChange={handleAccountChange}
            />
            {errors.account && (
              <ErrorMessage>{errors.account.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>

        <ButtonContainer>
          <BaseButton type="submit">Confirm</BaseButton>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        </ButtonContainer>
      </form>
    </Modal>
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
