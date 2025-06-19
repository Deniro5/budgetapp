import { PageContainer } from "../../styles.ts";

import { useState } from "react";

import { InvestmentsHeader } from "./InvestmentsHeader/InvestmentsHeader.tsx";
import AddInvestmentModal from "./AddInvestmentModal/AddInvestmentModal.tsx";
import { RawInvestment } from "types/investment.ts";
import { useInvestmentSearch } from "./hooks/useInvestmentSearch.ts";

export enum InvestmentsOverlayType {
  ADD = "add",
}

export const InvestmentsPage = () => {
  const [activeOverlay, setActiveOverlay] =
    useState<InvestmentsOverlayType | null>(null);

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
  };

  const handleAddInvestment = (investment: RawInvestment) => {
    console.log(investment);
  };

  return (
    <PageContainer>
      <InvestmentsHeader setActiveOverlay={setActiveOverlay} />

      {activeOverlay === InvestmentsOverlayType.ADD && (
        <AddInvestmentModal
          onClose={handleCloseOverlay}
          onSubmit={handleAddInvestment}
        />
      )}
    </PageContainer>
  );
};
