import { Flex, PageContainer } from "../../styles.ts";
import styled from "styled-components";
import { COLORS, SPACING } from "theme";
import { useState } from "react";
import useTransaction from "./hooks/useTransaction.ts";

import { PresetTransaction, Transaction } from "types/Transaction";
import { TransactionFilter } from "src/types/Transaction.ts";
import TransactionAddModal from "./components/Modals/TransactionAddModal/index.tsx";
import TransactionDeleteModal from "./components/Modals/TransactionDeleteModal/index.tsx";
import TransactionEditModal from "./components/Modals/TransactionEditModal/index.tsx";
import TransactionContextMenu from "./components/TransactionContextMenu/index.tsx";
import TransactionsSearchBar from "./components/TransactionSearchBar/index.tsx";
import DateMenu from "../../components/DateMenu/index.tsx";
import TransactionFilterButton from "./components/TransactionSearchBar/TransactionFilterButton/index.tsx";
import TransactionsHeader from "./components/TransactionsHeader/index.tsx";
import TransactionSidebar from "./components/TransactionSidebar.tsx/index.tsx";
import TransactionTable from "./components/TransactionTable/index.tsx";
import TransactionFilterRow from "./components/TransactionFilterRow/index.tsx";
import { AddPresetTransactionModal } from "./components/Modals/AddPresetTransactionModal/AddPresetTransactionModal.tsx";
import TransactionCopyModal from "./components/Modals/TransactionCopyModal/index.tsx";

import useCalendar from "../../hooks/useCalendar.ts";
import TransferAddModal from "./components/Modals/TransferAddModal/index.tsx";
import TransferEditModal from "./components/Modals/TransferEditModal/TransferEditModal.tsx";
import { TransferCopyModal } from "./components/Modals/TransferCopyModal/TransferCopyModal.tsx";
import usePresetTransactions from "./hooks/usePresetTransaction.ts";
import { EditPresetTransactionModal } from "./components/Modals/EditPresetTransactionModal/EditPresetTransactionModal.tsx";
import { CopyPresetTransactionModal } from "./components/Modals/CopyPresetTransactionModal/CopyPresetTransactionModal.tsx";
import { DeletePresetTransactionModal } from "./components/DeletePresetTransactionModal/DeletePresetTransactionModal.tsx";
import { isPresetTransaction, isTransaction } from "./utils";

export enum TransactionOverlayType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
  CONTEXT = "context",
  COPY = "copy",
  ADD_TRANSFER = "addTransfer",
  EDIT_TRANSFER = "editTransfer",
  COPY_TRANSFER = "copyTransfer",
  ADD_PRESET = "addPreset",
  COPY_PRESET = "copyPreset",
  DELETE_PRESET = "deletePreset",
  EDIT_PRESET = "editPreset",
}

export type View = "Transactions" | "Preset";

function Transactions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionFilter>({});
  const [view, setView] = useState<View>("Transactions");

  const [sidebarTransactionId, setSidebarTransactionId] = useState<
    string | null
  >(null);
  const [activeTransaction, setActiveTransaction] = useState<
    Transaction | PresetTransaction | null
  >(null);
  const [activeOverlay, setActiveOverlay] =
    useState<TransactionOverlayType | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });

  const { startDate, setStartDate, endDate, setEndDate } = useCalendar();

  const { transactions, transactionCount, loadMore, isLoading, error } =
    useTransaction({
      search,
      filter,
      startDate,
      endDate,
    });

  const {
    presetTransactions,
    presetTransactionCount,
    loadMore: loadMorePreset,
    isLoading: isLoadingPreset,
    error: errorPreset,
  } = usePresetTransactions({
    search,
    filter,
    startDate,
    endDate,
  });

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
    setActiveTransaction(null);
  };

  const hasFilters = Object.values(filter).some((val) => !!val);

  const currentTransactions =
    view === "Transactions" ? transactions : presetTransactions;
  const currentLoading = view === "Transactions" ? isLoading : isLoadingPreset;
  const currentError = view === "Transactions" ? error : errorPreset;
  const currentCount =
    view === "Transactions" ? transactionCount : presetTransactionCount;
  const currentLoadMore = view === "Transactions" ? loadMore : loadMorePreset;

  return (
    <PageContainer>
      <TransactionsHeader
        setActiveOverlay={setActiveOverlay}
        setView={setView}
        view={view}
      />

      <PageColumnFlexContainer
        gap={hasFilters ? SPACING.spacing4x : SPACING.spacing9x}
      >
        <FiltersContainer>
          <TransactionsSearchBar setSearch={setSearch} search={search} />
          <TransactionFilterButton setFilter={setFilter} filter={filter} />
          {/* Ony show date menu if view is transactions */}
          {view === "Transactions" && (
            <DateMenu
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          )}
        </FiltersContainer>

        {hasFilters && (
          <TransactionFilterRow filter={filter} setFilter={setFilter} />
        )}
        <ContentContainer>
          <TableFlexContainer hasFilters={hasFilters}>
            <TransactionTable
              transactions={currentTransactions}
              loading={currentLoading}
              loadMore={currentLoadMore}
              error={currentError}
              sidebarTransactionId={sidebarTransactionId}
              setSidebarTransactionId={setSidebarTransactionId}
              setActiveTransaction={setActiveTransaction}
              setActiveOverlay={setActiveOverlay}
              setContextMenuPosition={setContextMenuPosition}
              view={view}
            />
            <TransactionCount>
              Showing {currentTransactions.length} of {currentCount}{" "}
              {view === "Transactions" ? "transactions" : "preset transactions"}
            </TransactionCount>
          </TableFlexContainer>
          <TransactionSidebar
            activeTransaction={activeTransaction}
            setActiveTransaction={setActiveTransaction}
            setActiveOverlay={setActiveOverlay}
          />
        </ContentContainer>
      </PageColumnFlexContainer>
      {activeOverlay === TransactionOverlayType.ADD && (
        <TransactionAddModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === TransactionOverlayType.COPY &&
        isTransaction(activeTransaction) && (
          <TransactionCopyModal
            onClose={handleCloseOverlay}
            initialTransaction={activeTransaction}
          />
        )}

      {activeOverlay === TransactionOverlayType.EDIT &&
        isTransaction(activeTransaction) && (
          <TransactionEditModal
            transaction={activeTransaction}
            onClose={handleCloseOverlay}
          />
        )}
      {activeOverlay === TransactionOverlayType.DELETE &&
        isTransaction(activeTransaction) && (
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
      {activeOverlay === TransactionOverlayType.ADD_TRANSFER && (
        <TransferAddModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === TransactionOverlayType.EDIT_TRANSFER &&
        isTransaction(activeTransaction) && (
          <TransferEditModal
            onClose={handleCloseOverlay}
            transaction={activeTransaction}
          />
        )}

      {activeOverlay === TransactionOverlayType.COPY_TRANSFER &&
        isTransaction(activeTransaction) && (
          <TransferCopyModal
            onClose={handleCloseOverlay}
            initialTransaction={activeTransaction}
          />
        )}
      {activeOverlay === TransactionOverlayType.ADD_PRESET && (
        <AddPresetTransactionModal onClose={handleCloseOverlay} />
      )}

      {activeOverlay === TransactionOverlayType.COPY_PRESET &&
        isPresetTransaction(activeTransaction) && (
          <CopyPresetTransactionModal
            initialTransaction={activeTransaction}
            onClose={handleCloseOverlay}
          />
        )}
      {activeOverlay === TransactionOverlayType.EDIT_PRESET &&
        isPresetTransaction(activeTransaction) && (
          <EditPresetTransactionModal
            initialTransaction={activeTransaction}
            onClose={handleCloseOverlay}
          />
        )}

      {activeOverlay === TransactionOverlayType.DELETE_PRESET &&
        isPresetTransaction(activeTransaction) && (
          <DeletePresetTransactionModal
            transaction={activeTransaction}
            onClose={handleCloseOverlay}
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

const ContentContainer = styled(Flex)`
  align-items: flex-start;
`;

const TableFlexContainer = styled(Flex)<{ hasFilters: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-height: ${({ hasFilters }) =>
    hasFilters ? "calc(100vh - 268px)" : "calc(100vh - 225px)"};
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${SPACING.spacing6x};
`;

const TransactionCount = styled.p`
  text-align: center;
  margin: 0;
  font-weight: 600;
  color: ${COLORS.font};
`;

export default Transactions;
