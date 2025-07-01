import { Flex, PageContainer } from "../../styles.ts";

import { useState } from "react";

import { InvestmentsHeader } from "./InvestmentsHeader/InvestmentsHeader.tsx";
import AddInvestmentModal from "./AddInvestmentModal/AddInvestmentModal.tsx";
import { Asset, RawInvestment } from "types/investment.ts";
import { useCreateInvestment } from "./hooks/useCreateInvestment.ts";
import { useFetchInvestments } from "./hooks/useFetchInvestments.ts";
import { InvestmentCard } from "./InvestmentCard/InvestmentCard.tsx";
import styled from "styled-components";
import { SPACING } from "theme";
import SellInvestmentModal from "./SellInvestmentModal/SellInvestmentModal.tsx";
import { InvestmentHistoryModal } from "./InvestmentHistoryModal/InvestmentHistoryModal.tsx";

export enum InvestmentsOverlayType {
  ADD = "add",
  SELL = "sell",
  HISTORY = "history",
}

export const InvestmentsPage = () => {
  const { mutate } = useCreateInvestment();
  const { results, currentInvestmentsQuantityMap } = useFetchInvestments();
  const [activeOverlay, setActiveOverlay] =
    useState<InvestmentsOverlayType | null>(null);
  const [presetValues, setPresetValues] = useState<Partial<RawInvestment>>({});

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
  };

  const handleInvestmentSubmit = (investment: RawInvestment) => {
    mutate(investment);
  };

  return (
    <PageContainer>
      <InvestmentsHeader setActiveOverlay={setActiveOverlay} />
      <InvestmentCardContainer>
        {results.map((investment) => (
          <InvestmentCard
            setActiveOverlay={setActiveOverlay}
            setPresetValues={setPresetValues}
            investment={investment}
          />
        ))}
      </InvestmentCardContainer>

      {activeOverlay === InvestmentsOverlayType.ADD && (
        <AddInvestmentModal
          onClose={handleCloseOverlay}
          onSubmit={handleInvestmentSubmit}
          presetValues={presetValues}
          currentInvestmentsQuantityMap={currentInvestmentsQuantityMap}
        />
      )}

      {activeOverlay === InvestmentsOverlayType.SELL && (
        <SellInvestmentModal
          onClose={handleCloseOverlay}
          onSubmit={handleInvestmentSubmit}
          presetValues={presetValues}
          assetsList={results.map((investment) => investment.asset)}
          currentInvestmentsQuantityMap={currentInvestmentsQuantityMap}
        />
      )}

      {activeOverlay === InvestmentsOverlayType.HISTORY && (
        <InvestmentHistoryModal onClose={handleCloseOverlay} />
      )}
    </PageContainer>
  );
};

const InvestmentCardContainer = styled(Flex)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${SPACING.spacing6x};
  justify-content: center; /* Horizontally center the grid */
  margin-top: ${SPACING.spacing6x};
`;
