import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

import styled from "styled-components";
import { Flex } from "styles";
import { FONTSIZE, SPACING, COLORS } from "theme";
import { TransactionCategory } from "types/Transaction";
import { useBudgetWidget } from "./useBudgetWidget";
import renderChart from "../Hocs/renderChart";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";
import { formatToCurrency, truncateString } from "utils";

type BudgetWidgetProps = {
  startDate: string;
  endDate: string;
};

export const BudgetWidget = ({ startDate, endDate }: BudgetWidgetProps) => {
  const {
    categoriesWithBudget,
    totalBudget,
    availableBudget,
    isLoading,
    error,
  } = useBudgetWidget({ startDate, endDate });
  const isWithinBudget = availableBudget > 0;

  const chartElement = (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={categoriesWithBudget}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        barCategoryGap={10}
        barGap={2}
        barSize={100}
      >
        <XAxis
          dataKey="category"
          angle={-45}
          textAnchor="end"
          height={80}
          tickFormatter={(category: TransactionCategory) =>
            truncateString(category as string, 12)
          }
        />

        <Tooltip
          formatter={(value, name, props) => {
            if (name === "Spent")
              return [formatToCurrency(props.payload.rawTotalAmount), "Spent"];
            if (name === "Budget Limit")
              return [
                formatToCurrency(props.payload.rawBudget),
                "Budget Limit",
              ];
            return [value, name];
          }}
          labelFormatter={(label: TransactionCategory) => label}
        />
        <Legend
          payload={[
            { value: "Budget Limit", type: "square", color: COLORS.lightFont },
            {
              value: "Spent (Within Budget)",
              type: "square",
              color: COLORS.darkGreen,
            },
            {
              value: "Spent (Over Budget)",
              type: "square",
              color: COLORS.deleteRed,
            },
          ]}
          verticalAlign="top"
          wrapperStyle={{ marginTop: "-20px" }}
        />
        <Bar dataKey="budget" fill={COLORS.lightFont} name="Budget Limit">
          <LabelList fontSize={13} dataKey="rawBudget" position="top" />
        </Bar>
        <Bar dataKey="totalAmount" name="Spent">
          {categoriesWithBudget.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isOverBudget ? COLORS.deleteRed : COLORS.darkGreen}
            />
          ))}
          <LabelList fontSize={13} dataKey="rawTotalAmount" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const chartContent = renderChart({
    isEmpty: categoriesWithBudget?.length === 0,
    loading: isLoading,
    error: error,
    chartElement,
    loadingElement: <SkeletonLoader height={400} rows={1} columns={1} />,
  });

  return (
    <>
      <Header>
        <Name> Budget Status</Name>
        <InfoRow>
          <InfoSection>
            <Label>Budget Total:</Label>
            <p>{formatToCurrency(totalBudget)} </p>
          </InfoSection>
          <InfoSection>
            <Label>Budget Remaining:</Label>
            <ChangeLabel $isIncrease={isWithinBudget}>
              {formatToCurrency(availableBudget)}
            </ChangeLabel>
          </InfoSection>
        </InfoRow>
      </Header>
      {chartContent}
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

const ChangeLabel = styled(Flex)<{ $isIncrease: boolean }>`
  gap: ${SPACING.spacingBase};
  color: ${({ $isIncrease }) => ($isIncrease ? "green" : COLORS.deleteRed)};
  font-weight: bold;
  font-size: ${FONTSIZE.lg};
`;

const InfoRow = styled(Flex)`
  gap: ${SPACING.spacing6x};
`;

const InfoSection = styled(Flex)`
  gap: ${SPACING.spacingBase};
`;
