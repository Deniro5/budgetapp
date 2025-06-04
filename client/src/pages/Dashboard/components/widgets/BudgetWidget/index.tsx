import { transactionCategoryNameMap } from "constants/transactionCategoryNameMap";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { getAggregatedTotalBudget } from "store/budget/budgetSelectors";
import {
  getAggregatedCategoriesWithBudget,
  getTotalExpense,
} from "store/dashboard/dashboardSelectors";
import styled from "styled-components";
import { Flex } from "styles";
import { FONTSIZE, SPACING, COLORS } from "theme";
import {
  TransactionCategory,
  TransactionCategoryNameMap,
} from "types/Transaction";

type BudgetWidgetProps = {
  startDate: string;
  endDate: string;
};

const BudgetWidget = ({ startDate, endDate }: BudgetWidgetProps) => {
  const categoriesWithBudget = getAggregatedCategoriesWithBudget(
    startDate,
    endDate
  );

  const totalBudget = getAggregatedTotalBudget(startDate, endDate);
  const totalExpense = getTotalExpense();
  const availableMoney = totalBudget - totalExpense;
  const isWithinBudget = availableMoney > 0;

  return (
    <>
      <Header>
        <Name> Budget Status</Name>
        <InfoRow>
          <InfoSection>
            {" "}
            <Label>Budget Remaining:</Label>
            <ChangeLabel isIncrease={isWithinBudget}>
              ${availableMoney}
            </ChangeLabel>
          </InfoSection>
          <InfoSection>
            <Label>Budget Total:</Label>
            <p>${totalBudget} </p>
          </InfoSection>

          <InfoSection>
            <Label>Total Expenses:</Label>
            <p>${totalExpense} </p>
          </InfoSection>
        </InfoRow>
      </Header>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={categoriesWithBudget}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          barCategoryGap={10}
          barGap={0}
        >
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={80}
            tickFormatter={(category: TransactionCategory) =>
              TransactionCategoryNameMap[category] || category
            }
          />

          <Tooltip
            formatter={(value, name, props) => {
              if (name === "Spent")
                return [props.payload.rawTotalAmount, "Spent"];
              if (name === "Budget Limit")
                return [props.payload.rawBudget, "Budget Limit"];
              return [value, name];
            }}
            labelFormatter={(label: TransactionCategory) =>
              transactionCategoryNameMap[label] || label
            }
          />
          <Legend />
          <Bar dataKey="totalAmount" fill="#4285F4" name="Spent">
            <LabelList
              dx={-4}
              fontSize={12}
              dataKey="rawTotalAmount"
              position="top"
            />
          </Bar>
          <Bar dataKey="budget" fill="#EA4335" name="Budget Limit">
            <LabelList
              fontSize={12}
              dataKey="rawBudget"
              position="top"
              dx={4}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

const Name = styled.h3`
  margin: 0;
  font-size: ${FONTSIZE.lg};
`;

const Label = styled.p`
  margin-left: 0;
  font-weight: 700;
`;

const Header = styled(Flex)`
  margin-bottom: ${SPACING.spacing6x};
  justify-content: space-between;
  border-bottom: 1px solid lightgrey;
`;

const ChangeLabel = styled(Flex)<{ isIncrease: boolean }>`
  gap: ${SPACING.spacingBase};
  color: ${({ isIncrease }) => (isIncrease ? "green" : COLORS.deleteRed)};
  font-weight: bold;
  font-size: ${FONTSIZE.lg};
`;

const InfoRow = styled(Flex)`
  gap: ${SPACING.spacing6x};
`;

const InfoSection = styled(Flex)`
  gap: ${SPACING.spacingBase};
`;

export default BudgetWidget;
