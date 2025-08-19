import styled from "styled-components";
import { BaseButton, Divider, ScrollableContainer } from "styles";
import { SPACING, FONTSIZE, COLORS } from "theme";
import Modal from "components/Global/Modal";
import { useFetchInvestmentHistory } from "../hooks/useFetchInvestmentHistory";
import { InvestmentHistoryItem } from "./InvestmentHistoryItem";
import { useState } from "react";
import { DeleteInvestmentModal } from "./DeleteInvestmentModal";

type InvestmentHistoryModalProps = {
  onClose: () => void;
};

export function InvestmentHistoryModal({
  onClose,
}: InvestmentHistoryModalProps) {
  const { results, isLoading, error } = useFetchInvestmentHistory();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
  };

  const handleDeleteClose = () => {
    setIdToDelete(null);
  };
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
              key={investment._id}
              investment={investment}
              onClickDelete={handleDeleteClick}
            />
          ))}
        </ResultsContainer>
      )}
      <ButtonContainer>
        <BaseButton onClick={onClose}>Close</BaseButton>
      </ButtonContainer>

      {idToDelete && (
        <DeleteInvestmentModal
          investmentId={idToDelete}
          onClose={handleDeleteClose}
        />
      )}
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
