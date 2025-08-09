import styled from "styled-components";
import { BaseButton, Divider, ScrollableContainer } from "styles";

import { SPACING, FONTSIZE, COLORS } from "theme";

import Modal from "components/Global/Modal";
import { useFetchInvestmentHistory } from "../hooks/useFetchInvestmentHistory";
import { InvestmentHistoryItem } from "./InvestmentHistoryItem";
import { getAccountNameByIdMap } from "store/account/accountSelectors";

type InvestmentHistoryModalProps = {
  onClose: () => void;
};

export function InvestmentHistoryModal({
  onClose,
}: InvestmentHistoryModalProps) {
  const { results, isLoading, error } = useFetchInvestmentHistory();

  const accountNameByIdMap = getAccountNameByIdMap();
  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <Title>{"Investment History"}</Title>
      <Divider />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ResultsContainer>
          {results.map((investment) => (
            <InvestmentHistoryItem
              key={investment.asset.symbol}
              investment={{
                ...investment,
                account: accountNameByIdMap[investment.account],
              }}
            />
          ))}
        </ResultsContainer>
      )}
      <ButtonContainer>
        <BaseButton onClick={onClose}>Close</BaseButton>
      </ButtonContainer>
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;

const ResultsContainer = styled(ScrollableContainer)`
  height: 500px;
`;
