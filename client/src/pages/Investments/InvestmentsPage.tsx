import { Flex, PageContainer } from "../../styles.ts";
import { useState } from "react";
import { InvestmentsHeader } from "./InvestmentsHeader/InvestmentsHeader.tsx";
import AddInvestmentModal from "./AddInvestmentModal/AddInvestmentModal.tsx";
import { RawInvestment } from "types/investment.ts";
import { useCreateInvestment } from "./hooks/useCreateInvestment.ts";
import { useFetchInvestments } from "./hooks/useFetchInvestments.ts";
import { InvestmentCard } from "./InvestmentCard/InvestmentCard.tsx";
import styled from "styled-components";
import { SPACING } from "theme";
import SellInvestmentModal from "./SellInvestmentModal/SellInvestmentModal.tsx";
import { InvestmentHistoryModal } from "./InvestmentHistoryModal/InvestmentHistoryModal.tsx";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader.tsx";

export enum InvestmentsOverlayType {
  ADD = "add",
  SELL = "sell",
  HISTORY = "history",
}

export const InvestmentsPage = () => {
  const { mutate } = useCreateInvestment();
  const { results, getInvestmentsByAccount, isLoading, error } =
    useFetchInvestments();
  const investmentsByAccount = getInvestmentsByAccount();

  const [activeOverlay, setActiveOverlay] =
    useState<InvestmentsOverlayType | null>(null);
  const [presetValues, setPresetValues] = useState<Partial<RawInvestment>>({});

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
  };

  const handleInvestmentSubmit = (investment: RawInvestment) => {
    mutate(investment);
  };

  const getPageContent = () => {
    if (isLoading) return <SkeletonLoader rows={1} columns={3} height={500} />;
    if (error)
      return <div>Failed to load investments. Please refresh the page</div>;
    if (!results.length) return <div>No investments found</div>;

    return (
      <InvestmentCardContainer>
        {results.map((investment) => (
          <InvestmentCard
            setActiveOverlay={setActiveOverlay}
            setPresetValues={setPresetValues}
            investment={investment}
          />
        ))}
      </InvestmentCardContainer>
    );
  };

  return (
    <PageContainer>
      <InvestmentsHeader setActiveOverlay={setActiveOverlay} />
      {getPageContent()}
      {activeOverlay === InvestmentsOverlayType.ADD && (
        <AddInvestmentModal
          onClose={handleCloseOverlay}
          onSubmit={handleInvestmentSubmit}
          presetValues={presetValues}
          investmentsByAccount={investmentsByAccount}
        />
      )}

      {activeOverlay === InvestmentsOverlayType.SELL && (
        <SellInvestmentModal
          onClose={handleCloseOverlay}
          onSubmit={handleInvestmentSubmit}
          presetValues={presetValues}
          assetsList={results.map((investment) => investment.asset)}
          investmentsByAccount={investmentsByAccount}
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
`;
