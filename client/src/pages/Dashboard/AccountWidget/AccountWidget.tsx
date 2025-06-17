import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import styled from "styled-components";
import { Flex } from "styles";
import { FONTSIZE, SPACING } from "theme";

import { getAccountids } from "store/account/accountSelectors";
import { useAccountWidget } from "./useAccountWidget";
import { useState } from "react";
import AccountDropdown from "components/AccountDropdown/AccountDropdown";

type AccountWidgetProps = {
  startDate: string;
  endDate: string;
};

export const AccountWidget = ({ startDate, endDate }: AccountWidgetProps) => {
  const [accountWidgetId, setAccountWidgetId] = useState("All");

  const { accountWithBalances } = useAccountWidget({
    startDate,
    endDate,
    accountWidgetId,
  });
  const accountIds = getAccountids();

  const handleAccountChange = (id: string) => {
    setAccountWidgetId(id);
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
        <span>
          {" "}
          <b>
            {" "}
            {accountWithBalances[accountWithBalances.length - 1]?.balance || ""}
          </b>
        </span>
        <AccountDropdown
          accountsList={["All", ...accountIds]}
          selectedAccountId={accountWidgetId}
          handleAccountChange={handleAccountChange}
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
