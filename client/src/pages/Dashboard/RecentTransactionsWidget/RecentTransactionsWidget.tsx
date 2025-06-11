import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { useNavigate } from "react-router";
import { Flex, SecondaryButton } from "styles";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import TransactionTable from "../../../pages/Transaction/components/TransactionTable";
import TransactionAddModal from "../../../pages/Transaction/components/Modals/TransactionAddModal";
import { useRecentTransactionsWidget } from "./useRecentTransactionsWidget";

export const RecentTransactionsWidget = () => {
  const { recentTransactions, isLoading, error, refetch } =
    useRecentTransactionsWidget();

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleAddClick = () => {
    setShowModal(true);
  };

  const addTransactionCallback = () => {
    refetch();
  };

  if (!recentTransactions?.length) {
    return null;
  }

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
          loading={isLoading}
          error={error?.message || null}
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
};

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
