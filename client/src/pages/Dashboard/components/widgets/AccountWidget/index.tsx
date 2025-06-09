import DropdownList from "components/DropdownList/DropdownList";
import { transactionCategoryNameMap } from "constants/transactionCategoryNameMap";

import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";
import { getAggregatedValue } from "../../../../../utils/DateUtils";
import useBudgetStore from "store/budget/budgetStore";
import useDashboardStore from "store/dashboard/dashboardStore";
import { getUserTransactionCategories } from "store/user/userSelectors";
import styled from "styled-components";
import { Flex } from "styles";
import { FONTSIZE, SPACING } from "theme";
import { TransactionCategory } from "types/Transaction";
import { getAggregatedCategoryBudgetLine } from "store/budget/budgetSelectors";
import {
  getAccountById,
  getAccountids,
  getAccountNameByIdMap,
} from "store/account/accountSelectors";

type AccountWidgetProps = {
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
};

const AccountWidget = ({ id, setId }: AccountWidgetProps) => {
  const accountIds = getAccountids();
  const accountNameByIdMap = getAccountNameByIdMap();
  const { accountWithBalances } = useDashboardStore();

  const handleAccountChange = (id: string) => {
    setId(id);
  };

  const ChartContent = () => {
    if (!accountWithBalances.length) {
      return <b> No data to show.</b>;
    } else {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={accountWithBalances}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <YAxis />
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
            <Tooltip />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#82ca9d"
              fill="url(#colorIncome)"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <>
      <Header>
        <Name> Account Status </Name>
        <DropdownList
          items={["All", ...accountIds]}
          selected={id}
          onSelect={handleAccountChange}
          placeholder="Select Account"
          itemToString={(item: string) => accountNameByIdMap[item] || item}
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

export default AccountWidget;
