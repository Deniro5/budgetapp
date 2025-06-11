import DropdownList from "components/DropdownList/DropdownList";
import { transactionCategoryNameMap } from "constants/transactionCategoryNameMap";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { getUserTransactionCategories } from "store/user/userSelectors";
import styled from "styled-components";
import { Flex } from "styles";
import { FONTSIZE, SPACING } from "theme";
import { TransactionCategory } from "types/Transaction";
import { getAggregatedCategoryBudgetLine } from "store/budget/budgetSelectors";
import { useCategoryLineWidget } from "./useCategoryLineWidget";

type CategoryLineWidgetProps = {
  startDate: string;
  endDate: string;
};

export const CategoryLineWidget = ({
  startDate,
  endDate,
}: CategoryLineWidgetProps) => {
  const { categoryExpenseByDate, category, setCategory } =
    useCategoryLineWidget({
      startDate,
      endDate,
    });
  const userTransactionCategories = getUserTransactionCategories();

  const ChartContent = () => {
    if (!categoryExpenseByDate.length) {
      return <p> no data</p>;
    } else {
      const budgetLineValue = getAggregatedCategoryBudgetLine(
        startDate,
        endDate,
        category
      );

      return (
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
            <Tooltip />

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
                  value: `Aggregated Budget Limit : $${budgetLineValue}`,
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
    }
  };

  return (
    <>
      <Header>
        <Name> Budget by Category </Name>
        <DropdownList
          items={userTransactionCategories}
          selected={category}
          onSelect={setCategory}
          placeholder="Select Category"
          itemToString={(item: TransactionCategory) =>
            transactionCategoryNameMap[item]
          }
          searchable
        />
      </Header>
      <ChartContent />
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
