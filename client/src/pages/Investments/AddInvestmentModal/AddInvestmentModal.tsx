import { RawInvestment } from "types/investment";

import { useAssetSearch } from "../hooks/useAssetSearch";
import { BaseInvestmentModal } from "../BaseInvestmentModal/BaseInvestmentModal";

type AddInvestmentModalProps = {
  onClose: () => void;
  onSubmit: (investment: RawInvestment) => void;
  presetValues: Partial<RawInvestment>;
  investmentsByAccount: Record<string, Record<string, number>>;
};

export default function AddInvestmentModal({
  onClose,
  onSubmit,
  presetValues,
  investmentsByAccount,
}: AddInvestmentModalProps) {
  const { results, input, setInput } = useAssetSearch();

  const onSubmitForm = (data: RawInvestment) => {
    onSubmit(data);
    onClose();
  };

  return (
    <BaseInvestmentModal
      title="Add Investment"
      onClose={onClose}
      onSubmit={onSubmitForm}
      presetValues={presetValues}
      assetsList={results}
      input={input}
      setInput={setInput}
      investmentsByAccount={investmentsByAccount}
    />
  );
}
