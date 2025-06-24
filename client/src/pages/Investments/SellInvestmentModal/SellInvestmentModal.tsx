import { Asset, RawInvestment } from "types/investment";

import { useAssetSearch } from "../hooks/useAssetSearch";
import { BaseInvestmentModal } from "../BaseInvestmentModal/BaseInvestmentModal";
import { useState } from "react";
import { useSearchDropdown } from "components/SearchDropdown/hooks/useSearchDropdown";

type SellInvestmentModalProps = {
  onClose: () => void;
  onSubmit: (investment: RawInvestment) => void;
  presetValues: Partial<RawInvestment>;
  assetsList: Asset[];
  currentInvestmentsQuantityMap: Record<string, number>;
};

const assetToString = (asset: Asset) => {
  return `${asset.name} (${asset.symbol})`;
};

export default function SellInvestmentModal({
  onClose,
  onSubmit,
  presetValues,
  assetsList,
  currentInvestmentsQuantityMap,
}: SellInvestmentModalProps) {
  const { input, setInput, results } = useSearchDropdown({
    items: assetsList,
    itemToString: assetToString,
  });
  const onSubmitForm = (data: RawInvestment) => {
    onSubmit({ ...data, quantity: -data.quantity });
    onClose();
  };

  return (
    <BaseInvestmentModal
      title="Sell Investment"
      onClose={onClose}
      onSubmit={onSubmitForm}
      presetValues={presetValues}
      input={input}
      setInput={setInput}
      assetsList={results}
      currentInvestmentsQuantityMap={currentInvestmentsQuantityMap}
      isSellModal
    />
  );
}
