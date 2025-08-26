import { Flex, PageContainer, ScrollablePageContainer } from "styles";
import { useState } from "react";
import { InvestmentsHeader } from "./InvestmentsHeader/InvestmentsHeader";
import AddInvestmentModal from "./AddInvestmentModal/AddInvestmentModal";
import { RawInvestment } from "types/investment";
import { useCreateInvestment } from "./hooks/useCreateInvestment";
import { useFetchInvestments } from "./hooks/useFetchInvestments";
import { InvestmentCard } from "./InvestmentCard/InvestmentCard";
import styled from "styled-components";
import { SPACING } from "theme";
import SellInvestmentModal from "./SellInvestmentModal/SellInvestmentModal";
import { InvestmentHistoryModal } from "./InvestmentHistoryModal/InvestmentHistoryModal";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";

export enum InvestmentsOverlayType {
  ADD = "add",
  SELL = "sell",
  HISTORY = "history",
}

export default function InvestmentsPage() {
  const { mutate } = useCreateInvestment();
  const { results, isLoading, error } = useFetchInvestments();

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
            key={investment.asset._id}
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
      <ScrollablePageContainer>{getPageContent()}</ScrollablePageContainer>
      {activeOverlay === InvestmentsOverlayType.ADD && (
        <AddInvestmentModal
          onClose={handleCloseOverlay}
          onSubmit={handleInvestmentSubmit}
          presetValues={presetValues}
        />
      )}

      {activeOverlay === InvestmentsOverlayType.SELL && (
        <SellInvestmentModal
          onClose={handleCloseOverlay}
          onSubmit={handleInvestmentSubmit}
          presetValues={presetValues}
          assetsList={results.map((investment) => investment.asset)}
        />
      )}

      {activeOverlay === InvestmentsOverlayType.HISTORY && (
        <InvestmentHistoryModal onClose={handleCloseOverlay} />
      )}
    </PageContainer>
  );
}

const InvestmentCardContainer = styled(Flex)`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.spacing6x};

  align-items: stretch;
`;
