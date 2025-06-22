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
import { useEffect } from "react";

import AccountDropdown from "components/AccountDropdown/AccountDropdown";

import Modal from "components/Global/Modal";
import { Asset, RawInvestment } from "types/investment";
import { SearchDropdown } from "components/SearchDropdown/SearchDropdown";
import { useAssetSearch } from "../hooks/useAssetSearch";
import AssetMenuItem from "./AssetMenuItem";

type AddInvestmentModalProps = {
  onClose: () => void;
  onSubmit: (investment: RawInvestment) => void;
};

const investmentSearchResultRenderer = (asset: Asset) => (
  <AssetMenuItem asset={asset} />
);

export default function AddInvestmentModal({
  onClose,
  onSubmit,
}: AddInvestmentModalProps) {
  const { results, input, setInput } = useAssetSearch();
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
      asset: undefined,
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
    register("asset", {
      required: "Symbol is required",
    });
  }, [register]);

  const currentValues = watch();
  const handleAssetChange = (asset: Asset) => {
    setValue("asset", asset, { shouldValidate: true });
  };
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
              placeholder="Select Investment"
              selected={currentValues.asset}
              onSelect={function (item: Asset): void {
                handleAssetChange(item);
              }}
              itemRenderer={investmentSearchResultRenderer}
              itemToString={({ symbol, name }) => `${name} - ${symbol}`}
            />
            {errors.asset && (
              <ErrorMessage>{errors.asset.message}</ErrorMessage>
            )}
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
