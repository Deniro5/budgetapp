import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { useNavigate } from "react-router";
import { Flex } from "styles";
import { TransactionTable } from "pages/Transaction/shared/components";
import { useRecentTransactionsWidget } from "./useRecentTransactionsWidget";
import renderChart from "../Hocs/renderChart";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";

export const RecentTransactionsWidget = () => {
  const { recentTransactions, isLoading, error } =
    useRecentTransactionsWidget();

  const navigate = useNavigate();

  const chartElement = (
    <>
      <TableContainer>
        <TransactionTable
          loading={isLoading}
          error={error?.message || null}
          transactions={recentTransactions}
        />
        <ViewMoreLink onClick={() => navigate("transactions")}>
          View All Transactions
        </ViewMoreLink>
      </TableContainer>
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
