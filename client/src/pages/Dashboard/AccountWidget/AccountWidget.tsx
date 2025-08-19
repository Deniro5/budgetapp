import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  Line,
  ComposedChart,
} from "recharts";

import styled from "styled-components";
import { Flex } from "styles";
import { FONTSIZE, SPACING } from "theme";

import { useAccountWidget } from "./useAccountWidget";
import { useState } from "react";
import AccountDropdown from "components/AccountDropdown/AccountDropdown";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";
import renderChart from "../Hocs/renderChart";
import { formatCurrencyShort, formatToCurrency } from "utils";
import useAccounts from "pages/Accounts/hooks/useAccounts";

type AccountWidgetProps = {
  startDate: string;
  endDate: string;
};

export const AccountWidget = ({ startDate, endDate }: AccountWidgetProps) => {
  const [accountWidgetId, setAccountWidgetId] = useState("All");
  const { activeAccountIds } = useAccounts();

  const { accountWithBalances, isLoading, error } = useAccountWidget({
    startDate,
    endDate,
    accountWidgetId,
  });

  const handleAccountChange = (id: string) => {
    setAccountWidgetId(id);
  };

  const chartElement = (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart
        data={accountWithBalances}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <YAxis tickFormatter={(value) => formatCurrencyShort(value)} />
        <XAxis dataKey="date" />
        <Tooltip
          formatter={(value, name, props) => {
            if (name === "balance")
              return [
                formatToCurrency(props.payload.balance),
                "Available Balance",
              ];
            if (name === "value")
              return [formatToCurrency(props.payload.value), "Investments"];
            if (name === "total")
              return [formatToCurrency(props.payload.total), "Total Balance"];
            return [value, name];
          }}
        />

        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff7979" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ff7979" stopOpacity={0} />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey="total"
          stroke="#82ca9d"
          fill="url(#colorIncome)"
        />

        <Line
          type="natural"
          dataKey="value"
          stroke="#ff7979"
          strokeWidth={2}
          dot={false}
          strokeDasharray="7 1"
        />

        <Line
          type="basis"
          dataKey="balance"
          stroke="blue"
          strokeWidth={2}
          dot={false}
          strokeDasharray="7 1"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const chartContent = renderChart({
    isEmpty: !accountWithBalances.length,
    loading: isLoading,
    error,
    chartElement: chartElement,
    loadingElement: <SkeletonLoader height={350} rows={1} columns={1} />,
  });

  const lastEntry = accountWithBalances[accountWithBalances.length - 1];
  const lastTotal = (lastEntry?.value || 0) + (lastEntry?.balance || 0);

  return (
    <>
      <Header>
        <Name> Account Status </Name>
        <span>
          <b>{formatToCurrency(lastTotal)}</b>
        </span>
        <AccountDropdown
          accountsList={["All", ...activeAccountIds]}
          selectedAccountId={accountWidgetId}
          handleAccountChange={handleAccountChange}
        />
      </Header>
      {chartContent}
    </>
  );
};

const Name = styled.h3`
  margin: 0;
  font-size: ${FONTSIZE.lg};
`;

const Header = styled(Flex)`
  margin-bottom: ${SPACING.spacing6x};
  justify-content: space-between;
  border-bottom: 1px solid lightgrey;
  padding-bottom: ${SPACING.spacing3x};
`;
