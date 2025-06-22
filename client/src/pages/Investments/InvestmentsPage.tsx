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

export enum InvestmentsOverlayType {
  ADD = "add",
  SELL = "sell",
}

export const InvestmentsPage = () => {
  const { mutate } = useCreateInvestment();
  const { results } = useFetchInvestments();
  const [activeOverlay, setActiveOverlay] =
    useState<InvestmentsOverlayType | null>(null);

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
  };

  const handleAddInvestment = (investment: RawInvestment) => {
    mutate(investment);
  };

  return (
    <PageContainer>
      <InvestmentsHeader setActiveOverlay={setActiveOverlay} />
      <InvestmentCardContainer>
        {" "}
        {results.map((investment) => (
          <InvestmentCard investment={investment} />
        ))}{" "}
        {results.map((investment) => (
          <InvestmentCard investment={investment} />
        ))}{" "}
        {results.map((investment) => (
          <InvestmentCard investment={investment} />
        ))}{" "}
        {results.map((investment) => (
          <InvestmentCard investment={investment} />
        ))}{" "}
      </InvestmentCardContainer>

      {activeOverlay === InvestmentsOverlayType.ADD && (
        <AddInvestmentModal
          onClose={handleCloseOverlay}
          onSubmit={handleAddInvestment}
        />
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
