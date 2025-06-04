import useDashboardStore from "store/dashboard/dashboardStore";
import TransactionTable from "../../../../Transaction/components/TransactionTable";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { useNavigate } from "react-router";
import { BaseButton, Flex, SecondaryButton } from "styles";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import TransactionAddModal from "../../../../Transaction/components/Modals/TransactionAddModal";
import { Transaction } from "types/Transaction";
import usePresetTransaction from "../../../../Transaction/hooks/usePresetTransaction";

export default function RecentTransactionsWidget() {
  const {
    recentTransactions,
    recentTransactionsLoading,
    recentTransactionsError,
    addRecentTransaction,
  } = useDashboardStore();

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleAddClick = () => {
    setShowModal(true);
  };

  const addTransactionCallback = (transaction: Transaction) => {
    addRecentTransaction(transaction);
  };

  return (
    <>
      <WidgetHeader>
        <Name> Recent Transactions </Name>
        <SecondaryButton onClick={handleAddClick}>
          <FontAwesomeIcon icon={faAdd} />
          Add Transaction{" "}
        </SecondaryButton>
      </WidgetHeader>
      <TableContainer>
        <TransactionTable
          loading={recentTransactionsLoading}
          error={recentTransactionsError}
          transactions={recentTransactions}
          sidebarTransactionId={null}
          setSidebarTransactionId={() => {}}
          setActiveTransaction={() => {}}
          setActiveOverlay={() => {}}
          setContextMenuPosition={() => {}}
        />
        <ViewMoreLink onClick={() => navigate("transactions")}>
          View All Transactions
        </ViewMoreLink>
      </TableContainer>
      {showModal && (
        <TransactionAddModal
          addTransactionCallback={addTransactionCallback}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

const TableContainer = styled(Flex)`
  flex-direction: column;
`;

const Name = styled.h3`
  margin: 0;
  font-size: ${FONTSIZE.lg};
`;

const ViewMoreLink = styled.button`
  color: ${COLORS.primary};
  text-decoration: underline;
  border: none;
  background: none;
  cursor: pointer;
  font-size: ${FONTSIZE.md};
  margin-top: ${SPACING.spacing3x};
  font-weight: 500;
`;

const WidgetHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.spacing6x};
`;
