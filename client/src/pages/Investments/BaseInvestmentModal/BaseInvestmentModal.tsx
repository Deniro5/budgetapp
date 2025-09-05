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
import AssetMenuItem from "./AssetMenuItem";
import BalanceSummaryFooter from "components/BalanceSummaryFooter/BalanceSummaryFooter";
import { TransactionType } from "types/Transaction";
import useAccount from "pages/Accounts/hooks/useAccount";
import useAccounts from "pages/Accounts/hooks/useAccounts";

type BaseInvestmentModalProps = {
  title: string;
  onClose: () => void;
  onSubmit: (investment: RawInvestment) => void;
  presetValues: Partial<RawInvestment>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  assetsList: Asset[];
  isSellModal?: boolean;
};

export function BaseInvestmentModal({
  title,
  onClose,
  onSubmit,
  presetValues,
  assetsList,

  input,
  setInput,
  isSellModal,
}: BaseInvestmentModalProps) {
  const userPreferences = getUserPreferences();
  const { activeAccountIds, accountInvestmentSummaryByIdMap } = useAccounts();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<RawInvestment>({
    mode: "onSubmit", // Validation only on submit
    reValidateMode: "onSubmit", // No revalidation on field changes
    defaultValues: {
      asset: presetValues?.asset ?? undefined,
      quantity: presetValues?.quantity ?? 0,
      price: presetValues?.price ?? 0,
      date: presetValues?.date ?? new Date().toISOString().split("T")[0],
      account: presetValues?.account ?? userPreferences?.defaultAccount?._id,
    },
  });

  const currentValues = watch();
  const { account } = useAccount(currentValues.account);

  useEffect(() => {
    register("account", {
      required: "Account is required",
    });
    register("asset", {
      required: "Symbol is required",
    });
  }, [register]);

  const handleAssetChange = (asset: Asset) => {
    setValue("asset", asset, { shouldValidate: true });
    setValue("price", asset.history[0]?.price || 0, { shouldValidate: true });
  };
  const handleAccountChange = (accountId: string) => {
    setValue("account", accountId, { shouldValidate: true });
  };

  const onSubmitForm = (data: RawInvestment) => {
    onSubmit(data);
    onClose();
  };

  const getAccountInvestments = (accountId: string) =>
    accountInvestmentSummaryByIdMap[accountId] ?? [];

  const findAssetInAccount = (accountId: string, assetId: string) =>
    assetId
      ? getAccountInvestments(accountId).find((i) => i.asset._id === assetId)
      : undefined;

  const accountHasAsset = (accountId: string, assetId: string) =>
    !!findAssetInAccount(accountId, assetId);

  const getAssetQuantity = (accountId: string, assetId: string) =>
    findAssetInAccount(accountId, assetId)?.quantity ?? 0;

  const assetId = currentValues.asset?._id;

  const assetQuantityOwned = account
    ? getAssetQuantity(account._id, assetId)
    : 0;

  const filteredAccountIds = isSellModal
    ? activeAccountIds.filter((id) => accountHasAsset(id, assetId))
    : activeAccountIds;

  // set the modal default account to the first account that has the asset if we are selling and if the default account is not in the list
  useEffect(() => {
    if (isSellModal && !accountHasAsset(currentValues.account, assetId)) {
      const defaultAccount = activeAccountIds.find((id) =>
        accountHasAsset(id, assetId)
      );
      handleAccountChange(defaultAccount ?? "");
    }
  }, [isSellModal, activeAccountIds, assetId, currentValues.account]);

  const assetMenuItems = assetsList.map((asset) => {
    return {
      label: <AssetMenuItem asset={asset} />,
      function: () => handleAssetChange(asset),
    };
  });

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <Title>{title}</Title>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <SubTitle> Required Fields </SubTitle>
        <Row>
          <InputContainer>
            <InputLabel>Symbol</InputLabel>
            <SearchDropdown
              width={600}
              value={input}
              setValue={setInput}
              items={assetMenuItems}
              placeholder="Select Asset"
              selected={currentValues?.asset?.name ?? null}
            />
            {errors.asset && (
              <ErrorMessage>{errors.asset.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>

        <Row>
          <InputContainer>
            <InputLabel>
              Amount{" "}
              {currentValues.asset &&
                `currently in ${account?.name}: ${assetQuantityOwned}`}
            </InputLabel>
            <BaseInput
              {...register("quantity", {
                required: "Quantity is required",
                validate: (value) => {
                  if (isNaN(value)) return "Invalid number";
                  if (value > assetQuantityOwned && isSellModal)
                    return "Cannot sell more than owned";
                  return true;
                },
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
              accountsList={filteredAccountIds}
            />
            {errors.account && isSubmitted && (
              <ErrorMessage>{errors.account.message}</ErrorMessage>
            )}
          </InputContainer>
        </Row>

        <BalanceSummaryFooter
          account={account}
          amount={currentValues.quantity * currentValues.price}
          type={isSellModal ? TransactionType.INCOME : TransactionType.EXPENSE}
        />
        <ButtonContainer>
          <BaseButton type="submit">Confirm</BaseButton>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
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
