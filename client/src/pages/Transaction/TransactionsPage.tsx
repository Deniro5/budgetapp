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

import usePresetTransactions from "./PresetTransactions/hooks/usePresetTransactions.ts";
import useRecurringTransactions from "./RecurringTransactions/hooks/useRecurringTransactions.ts";

import {
  isPresetTransaction,
  isRecurringTransaction,
  isTransaction,
} from "./shared/utils/index.ts";
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
import {
  AddRecurringTransactionModal,
  CopyRecurringTransactionModal,
  DeleteRecurringTransactionModal,
  EditRecurringTransactionModal,
} from "./RecurringTransactions/modals";
import useTransactionStore from "store/transaction/transactionStore.ts";

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
  ADD_RECURRING = "addRecurring",
  COPY_RECURRING = "copyRecurring",
  DELETE_RECURRING = "deleteRecurring",
  EDIT_RECURRING = "editRecurring",
}

export type View = "Transactions" | "Preset" | "Recurring";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const { filter, setFilter } = useTransactionStore();
  const [view, setView] = useState<View>("Transactions");
  const { startDate, endDate, setStartDate, setEndDate } =
    useTransactionStore();

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

  const {
    recurringTransactions,
    recurringTransactionCount,
    loadMore: loadMoreRecurring,
    isLoading: isLoadingRecurring,
    error: errorRecurring,
  } = useRecurringTransactions({
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

  const getCurrentTransactions = () => {
    if (view === "Transactions") {
      return transactions;
    } else if (view === "Preset") {
      return presetTransactions;
    } else {
      return recurringTransactions;
    }
  };

  const getCurrentLoading = () => {
    if (view === "Transactions") {
      return isLoading;
    } else if (view === "Preset") {
      return isLoadingPreset;
    } else {
      return isLoadingRecurring;
    }
  };

  const getCurrentError = () => {
    if (view === "Transactions") {
      return error;
    } else if (view === "Preset") {
      return errorPreset;
    } else {
      return errorRecurring;
    }
  };

  const getCurrentCount = () => {
    if (view === "Transactions") {
      return transactionCount;
    } else if (view === "Preset") {
      return presetTransactionCount;
    } else {
      return recurringTransactionCount;
    }
  };

  const currentTransactions = getCurrentTransactions();
  const currentLoading = getCurrentLoading();
  const currentError = getCurrentError();
  const currentCount = getCurrentCount();

  const handleLoadMore = () => {
    if (currentError) return;

    if (view === "Transactions") {
      loadMore();
    } else if (view === "Preset") {
      loadMorePreset();
    } else {
      loadMoreRecurring();
    }
  };

  const getTransactionLabel = () => {
    if (view === "Preset") return "Preset Transaction";
    if (view === "Recurring") return "Recurring Transaction";
    return "Transaction";
  };

  const transactionLabel = getTransactionLabel();

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
              transactionLabel={transactionLabel}
            />
            <TransactionCount>
              Showing {currentTransactions.length} of {currentCount}{" "}
              {transactionLabel}s
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
            view={view}
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
      {activeOverlay === TransactionOverlayType.ADD_RECURRING && (
        <AddRecurringTransactionModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === TransactionOverlayType.COPY_RECURRING &&
        isRecurringTransaction(activeTransaction) && (
          <CopyRecurringTransactionModal
            initialTransaction={activeTransaction}
            onClose={handleCloseOverlay}
          />
        )}
      {activeOverlay === TransactionOverlayType.EDIT_RECURRING &&
        isRecurringTransaction(activeTransaction) && (
          <EditRecurringTransactionModal
            initialTransaction={activeTransaction}
            onClose={handleCloseOverlay}
          />
        )}
      {activeOverlay === TransactionOverlayType.DELETE_RECURRING &&
        isRecurringTransaction(activeTransaction) && (
          <DeleteRecurringTransactionModal
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
