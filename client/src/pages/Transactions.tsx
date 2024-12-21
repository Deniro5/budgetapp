import { Flex, PageContainer } from "../Styles";
import TransactionTable from "../components/Transactions/TransactionTable";
import TransactionsSearchRow from "../components/Transactions/TransactionSearchRow/index.tsx";
import TransactionsHeader from "../components/Transactions/TransactionsHeader";
import TransactionSidebar from "../components/Transactions/TransactionSidebar.tsx";
import styled from "styled-components";
import { SPACING } from "../Theme.ts";
import TransactionsFilterRow from "../components/Transactions/TransactionFilterRow/index.tsx";
import { useState } from "react";
import useTransaction from "../hooks/useTransaction.ts";
import TransactionContextMenu from "../components/Transactions/TransactionContextMenu/index.tsx";
import TransactionEditModal from "../components/Transactions/Modals/TransactionEditModal/index.tsx";
import { Transaction } from "../types/transaction.ts";
import TransactionDeleteModal from "../components/Transactions/Modals/TransactionDeleteModal/index.tsx";
import TransactionAddModal from "../components/Transactions/Modals/TransactionAddModal/index.tsx";

export enum TransactionOverlayType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
  CONTEXT = "context",
  PRESET = "preset",
}

function Transactions() {
  const [hasFilters, setHasFilters] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [activeTransaction, setActiveTransaction] =
    useState<Transaction | null>(null);
  const [activeOverlay, setActiveOverlay] =
    useState<TransactionOverlayType | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });

  const { transactions, isLoading, error } = useTransaction();

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
    setActiveTransaction(null);
  };

  return (
    <PageContainer>
      <TransactionsHeader setActiveOverlay={setActiveOverlay} />

      <PageColumnFlexContainer
        gap={hasFilters ? SPACING.spacing4x : SPACING.spacing9x}
      >
        <TransactionsSearchRow />
        {hasFilters && <TransactionsFilterRow />}
        <StyledTableContainer>
          <TransactionTable
            transactions={transactions}
            loading={isLoading}
            error={error}
            selectedTransactionId={selectedTransactionId}
            setSelectedTransactionId={setSelectedTransactionId}
            setActiveTransaction={setActiveTransaction}
            setActiveOverlay={setActiveOverlay}
            setContextMenuPosition={setContextMenuPosition}
          />
          <TransactionSidebar
            transactionId={selectedTransactionId}
            setActiveTransaction={setActiveTransaction}
            setActiveOverlay={setActiveOverlay}
          />
        </StyledTableContainer>
      </PageColumnFlexContainer>
      {activeOverlay === TransactionOverlayType.ADD && (
        <TransactionAddModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === TransactionOverlayType.PRESET && (
        <TransactionAddModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === TransactionOverlayType.EDIT && activeTransaction && (
        <TransactionEditModal
          transaction={activeTransaction}
          onClose={handleCloseOverlay}
        />
      )}
      {activeOverlay === TransactionOverlayType.DELETE && activeTransaction && (
        <TransactionDeleteModal
          transaction={activeTransaction}
          onClose={handleCloseOverlay}
        />
      )}
      {activeOverlay === TransactionOverlayType.CONTEXT &&
        activeTransaction && (
          <TransactionContextMenu
            activeTransaction={activeTransaction}
            onClose={handleCloseOverlay}
            setActiveOverlay={setActiveOverlay}
            top={contextMenuPosition.top}
            left={contextMenuPosition.left}
          />
        )}
      {/* {transactionToDelete && (
        <TransactionEditModal
          transaction={transactionToEdit}
          onClose={() => setTransactionToEdit(null)}
        />
      )} */}
    </PageContainer>
  );
}

const PageColumnFlexContainer = styled.div<{ gap: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap};
  margin-top: ${SPACING.spacing9x};
`;

const StyledTableContainer = styled(Flex)`
  align-items: flex-start;
`;

export default Transactions;
