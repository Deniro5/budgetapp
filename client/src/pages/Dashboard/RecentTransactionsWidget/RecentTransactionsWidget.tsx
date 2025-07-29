import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { useNavigate } from "react-router";
import { Flex, SecondaryButton } from "styles";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { TransactionTable } from "../../Transaction/shared/components";
import { useRecentTransactionsWidget } from "./useRecentTransactionsWidget";
import { AddTransactionModal } from "../../Transaction/Transactions/modals";
import renderChart from "../Hocs/renderChart";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";

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

  const chartElement = (
    <>
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
          view="Transactions"
        />
        <ViewMoreLink onClick={() => navigate("transactions")}>
          View All Transactions
        </ViewMoreLink>
      </TableContainer>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </>
  );

  const chartContent = renderChart({
    isEmpty: recentTransactions?.length === 0,
    loading: isLoading,
    error: error,
    chartElement,
    loadingElement: <SkeletonLoader height={40} rows={7} columns={1} />,
  });
  return (
    <>
      <WidgetHeader>
        <Name> Recent Transactions </Name>
        <SecondaryButton onClick={handleAddClick}>
          <FontAwesomeIcon icon={faAdd} />
          Add Transaction{" "}
        </SecondaryButton>
      </WidgetHeader>
      {chartContent}
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
