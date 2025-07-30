import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styled from "styled-components";
import { Flex } from "styles";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { useIncomeExpenseWidget } from "./useIncomeExpenseWidget";
import renderChart from "../Hocs/renderChart";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";
import { capitalize, formatCurrencyShort, formatToCurrency } from "utils";

interface IncomeExpenseWidgetProps {
  startDate: string;
  endDate: string;
}

export const IncomeExpenseWidget = ({
  startDate,
  endDate,
}: IncomeExpenseWidgetProps) => {
  const { totalIncomeAndExpenseByDate, netIncome, isLoading, error } =
    useIncomeExpenseWidget({
      startDate,
      endDate,
    });
  const isIncrease = netIncome >= 0;

  if (!totalIncomeAndExpenseByDate || totalIncomeAndExpenseByDate.length === 0)
    return null; // Handle empty data case

  const chartElement = (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={totalIncomeAndExpenseByDate}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
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
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => formatCurrencyShort(value)} />
        <Tooltip
          formatter={(value: number, name: string) => {
            return [formatToCurrency(value), capitalize(name)];
          }}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#82ca9d"
          fill="url(#colorIncome)"
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#ff7979"
          fill="url(#colorExpense)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const chartContent = renderChart({
    isEmpty: totalIncomeAndExpenseByDate.length === 0,
    loading: isLoading,
    error: error,
    chartElement,
    loadingElement: <SkeletonLoader height={350} rows={1} columns={1} />,
  });

  return (
    <>
      <Header>
        <Name> Income / Expenses </Name>
        <ChangeLabel isIncrease={isIncrease}>
          {isIncrease ? "+" : "-"} {formatToCurrency(netIncome)}
        </ChangeLabel>
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
  gap: ${SPACING.spacing8x};
  margin-bottom: ${SPACING.spacing4x};
  border-bottom: 1px solid lightgrey;
  padding-bottom: ${SPACING.spacing3x};
`;

const ChangeLabel = styled(Flex)<{ isIncrease: boolean }>`
  gap: ${SPACING.spacingBase};
  color: ${({ isIncrease }) => (isIncrease ? "green" : COLORS.deleteRed)};
  font-weight: bold;
  font-size: ${FONTSIZE.lg};
`;
