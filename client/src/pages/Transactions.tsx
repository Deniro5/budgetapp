import { Flex, PageContainer } from "../Styles";
import TransactionTable from "../components/Transactions/TransactionTable";
import TransactionsSearchBar from "../components/Transactions/TransactionSearchBar";
import TransactionsHeader from "../components/Transactions/TransactionsHeader";
import TransactionSidebar from "../components/Transactions/TransactionSidebar.tsx";
import styled from "styled-components";
import { SPACING } from "../Theme.ts";
import TransactionsFilterRow from "../components/Transactions/TransactionFilterRow/index.tsx";
import { useState } from "react";
import useTransaction from "../hooks/useTransaction.ts";
import TransactionContextMenu from "../components/Transactions/TransactionContextMenu/index.tsx";
import TransactionEditModal from "../components/Transactions/Modals/TransactionEditModal/index.tsx";
import { Transaction, TransactionFilter } from "../types/transaction.ts";
import TransactionDeleteModal from "../components/Transactions/Modals/TransactionDeleteModal/index.tsx";
import TransactionAddModal from "../components/Transactions/Modals/TransactionAddModal/index.tsx";
import TransactionFilterButton from "../components/Transactions/TransactionSearchBar/TransactionFilterButton/index.tsx";
import TransactionDateRange from "../components/Transactions/TransactionSearchBar/TransactionDateRange/index.tsx";

export enum TransactionOverlayType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
  CONTEXT = "context",
  PRESET = "preset",
}

function Transactions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionFilter>({});
  const [sidebarTransactionId, setSidebarTransactionId] = useState<
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

  const { transactions, isLoading, error } = useTransaction({ search, filter });

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
    setActiveTransaction(null);
  };

  const hasFilters = Object.keys(filter).length > 0;

  return (
    <PageContainer>
      <TransactionsHeader setActiveOverlay={setActiveOverlay} />
      <PageColumnFlexContainer
        gap={hasFilters ? SPACING.spacing4x : SPACING.spacing9x}
      >
        <FiltersContainer>
          <TransactionsSearchBar setSearch={setSearch} search={search} />
          <TransactionFilterButton setFilter={setFilter} filter={filter} />

          <TransactionDateRange />
        </FiltersContainer>

        {hasFilters && (
          <TransactionsFilterRow filter={filter} setFilter={setFilter} />
        )}
        <StyledTableContainer>
          <TransactionTable
            transactions={transactions}
            loading={isLoading}
            error={error}
            sidebarTransactionId={sidebarTransactionId}
            setSidebarTransactionId={setSidebarTransactionId}
            setActiveTransaction={setActiveTransaction}
            setActiveOverlay={setActiveOverlay}
            setContextMenuPosition={setContextMenuPosition}
          />
          <TransactionSidebar
            sidebarTransactionId={sidebarTransactionId}
            setActiveTransaction={setActiveTransaction}
            setActiveOverlay={setActiveOverlay}
          />
        </StyledTableContainer>
      </PageColumnFlexContainer>
      {activeOverlay === TransactionOverlayType.ADD && (
        <TransactionAddModal
          onClose={handleCloseOverlay}
          initialTransaction={activeTransaction}
        />
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

const FiltersContainer = styled.div`
  display: flex;
  gap: ${SPACING.spacing6x};
`;

export default Transactions;
