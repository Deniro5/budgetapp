import { Flex, PageContainer } from "../../styles.ts";
import styled from "styled-components";
import { COLORS, SPACING } from "theme";
import { useState } from "react";

import { PresetTransaction, Transaction } from "types/Transaction";
import { TransactionFilter } from "src/types/Transaction.ts";
import {
  TransactionContextMenu,
  TransactionSearchBar,
  TransactionFilterButton,
  TransactionHeader,
  TransactionSidebar,
  TransactionFilterRow,
  TransactionTable,
} from "./shared/components";

import DateMenu from "../../components/DateMenu/index.tsx";
import { AddPresetTransactionModal } from "./PresetTransactions/modals/AddPresetTransactionModal/AddPresetTransactionModal.tsx";

import useCalendar from "../../hooks/useCalendar.ts";

import usePresetTransactions from "./PresetTransactions/hooks/usePresetTransactions.ts";

import { isPresetTransaction, isTransaction } from "./shared/utils/index.ts";
import useTransactions from "./Transactions/hooks/useTransactions.ts";
import {
  AddTransactionModal,
  CopyTransactionModal,
  DeleteTransactionModal,
  EditTransactionModal,
} from "./Transactions/modals";

import {
  AddTransferModal,
  CopyTransferModal,
  DeleteTransferModal,
  EditTransferModal,
} from "./Transfers/modals";
import {
  EditPresetTransactionModal,
  CopyPresetTransactionModal,
  DeletePresetTransactionModal,
} from "./PresetTransactions/modals";

export enum TransactionOverlayType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
  CONTEXT = "context",
  COPY = "copy",
  ADD_TRANSFER = "addTransfer",
  COPY_TRANSFER = "copyTransfer",
  DELETE_TRANSFER = "deleteTransfer",
  EDIT_TRANSFER = "editTransfer",
  ADD_PRESET = "addPreset",
  COPY_PRESET = "copyPreset",
  DELETE_PRESET = "deletePreset",
  EDIT_PRESET = "editPreset",
}

export type View = "Transactions" | "Preset";

export default function TransactionsPage() {
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
    useTransactions({
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

  const handleLoadMore = () => {
    if (currentError) return;

    if (view === "Transactions") {
      loadMore();
    } else {
      loadMorePreset();
    }
  };

  return (
    <PageContainer>
      <TransactionHeader
        setActiveOverlay={setActiveOverlay}
        setView={setView}
        view={view}
      />

      <PageColumnFlexContainer
        gap={hasFilters ? SPACING.spacing4x : SPACING.spacing9x}
      >
        <FiltersContainer>
          <TransactionSearchBar setSearch={setSearch} search={search} />
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
              loadMore={handleLoadMore}
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
            view={view}
          />
        </ContentContainer>
      </PageColumnFlexContainer>
      {activeOverlay === TransactionOverlayType.ADD && (
        <AddTransactionModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === TransactionOverlayType.COPY &&
        isTransaction(activeTransaction) && (
          <CopyTransactionModal
            onClose={handleCloseOverlay}
            initialTransaction={activeTransaction}
          />
        )}

      {activeOverlay === TransactionOverlayType.EDIT &&
        isTransaction(activeTransaction) && (
          <EditTransactionModal
            transaction={activeTransaction}
            onClose={handleCloseOverlay}
          />
        )}
      {activeOverlay === TransactionOverlayType.DELETE &&
        isTransaction(activeTransaction) && (
          <DeleteTransactionModal
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
        <AddTransferModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === TransactionOverlayType.EDIT_TRANSFER &&
        isTransaction(activeTransaction) && (
          <EditTransferModal
            onClose={handleCloseOverlay}
            transaction={activeTransaction}
          />
        )}

      {activeOverlay === TransactionOverlayType.COPY_TRANSFER &&
        isTransaction(activeTransaction) && (
          <CopyTransferModal
            onClose={handleCloseOverlay}
            initialTransaction={activeTransaction}
          />
        )}
      {activeOverlay === TransactionOverlayType.DELETE_TRANSFER &&
        isTransaction(activeTransaction) && (
          <DeleteTransferModal
            onClose={handleCloseOverlay}
            transaction={activeTransaction}
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
