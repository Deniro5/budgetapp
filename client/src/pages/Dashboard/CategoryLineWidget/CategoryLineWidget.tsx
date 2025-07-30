import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import styled from "styled-components";
import { Flex } from "styles";
import { FONTSIZE, SPACING } from "theme";
import { TransactionCategory } from "types/Transaction";
import { getAggregatedCategoryBudgetLine } from "store/budget/budgetSelectors";
import { useCategoryLineWidget } from "./useCategoryLineWidget";
import CategoryDropdown from "components/CategoryDropdown/CategoryDropdown";
import renderChart from "../Hocs/renderChart";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";
import { capitalize, formatToCurrency } from "utils";

type CategoryLineWidgetProps = {
  startDate: string;
  endDate: string;
};

export const CategoryLineWidget = ({
  startDate,
  endDate,
}: CategoryLineWidgetProps) => {
  const { categoryExpenseByDate, category, setCategory, isLoading, error } =
    useCategoryLineWidget({
      startDate,
      endDate,
    });

  const handleSetCategory = (category: TransactionCategory) => {
    setCategory(category);
  };

  const budgetLineValue = getAggregatedCategoryBudgetLine(
    startDate,
    endDate,
    category
  );
  const chartElement = (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={categoryExpenseByDate}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <YAxis
          domain={[
            0,
            Math.max(
              200,
              budgetLineValue,
              ...categoryExpenseByDate.map((d) => d.expense)
            ),
          ]}
        />

        <XAxis dataKey="date" />
        <Tooltip
          formatter={(value: number, name: string) => {
            return [formatToCurrency(value), capitalize(name)];
          }}
        />

        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ff7979"
          strokeWidth={2}
          dot={false}
        />

        {budgetLineValue > 0 && (
          <ReferenceLine
            y={budgetLineValue}
            stroke="black"
            strokeDasharray="5 5"
            label={{
              value: `Aggregated Budget Limit : ${formatToCurrency(
                budgetLineValue
              )}`,
              position: "center",
              fill: "black",
              dy: -10,
              fontSize: 12,
              fontWeight: 600,
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  const chartContent = renderChart({
    isEmpty: categoryExpenseByDate?.length === 0,
    loading: isLoading,
    error: error,
    chartElement,
    loadingElement: <SkeletonLoader height={350} rows={1} columns={1} />,
  });

  return (
    <>
      <Header>
        <Name> Budget by Category </Name>
        <CategoryDropdown
          selectedCategory={category}
          handleCategoryChange={handleSetCategory}
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
