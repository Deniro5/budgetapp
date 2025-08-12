import { Flex, PageTitle } from "../../styles.ts";
import styled from "styled-components";
import { SPACING } from "theme";
import { DashboardCard } from "./DashboardCard/DashboardCard.tsx";
import { IncomeExpenseWidget } from "./IncomeExpenseWidget/IncomeExpenseWidget.tsx";
import { RecentTransactionsWidget } from "./RecentTransactionsWidget/RecentTransactionsWidget.tsx";

import DateMenu from "components/DateMenu/index.tsx";
import { CategoryLineWidget } from "./CategoryLineWidget/CategoryLineWidget.tsx";
import { BudgetWidget } from "./BudgetWidget/BudgetWidget.tsx";
import { AccountWidget } from "./AccountWidget/AccountWidget.tsx";
import useDashboardStore from "store/dashboard/dashboardStore.ts";

export const DashboardPage = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useDashboardStore();

  return (
    <PageContainer>
      <Flex>
        <PageTitle> Dashboard </PageTitle>
        <DateMenu
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </Flex>
      <DashboardContainer>
        <Column gridArea={"account"}>
          <DashboardCard>
            <AccountWidget startDate={startDate} endDate={endDate} />
          </DashboardCard>
        </Column>
        <Column gridArea={"income"}>
          <DashboardCard>
            <IncomeExpenseWidget startDate={startDate} endDate={endDate} />
          </DashboardCard>
        </Column>
        <Column gridArea={"budget"}>
          <DashboardCard>
            <BudgetWidget startDate={startDate} endDate={endDate} />
          </DashboardCard>
        </Column>
        <Column gridArea="categoryline">
          <DashboardCard>
            <CategoryLineWidget startDate={startDate} endDate={endDate} />
          </DashboardCard>
        </Column>
        <Column gridArea={"recent"}>
          <DashboardCard>
            <RecentTransactionsWidget />
          </DashboardCard>
        </Column>
      </DashboardContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.spacing6x};
`;

const DashboardContainer = styled.div`
  display: grid;
  grid-template-areas:
    "account income income income"
    "budget budget budget categoryline"
    "recent recent recent recent";
  grid-template-columns: 1fr 1fr 1fr 1fr; /* 3 equal columns */
  grid-template-rows: auto auto auto; /* Two rows */
  gap: ${SPACING.spacing6x};
`;

const Column = styled.div<{ gridArea: string }>`
  grid-area: ${({ gridArea }) => gridArea};
`;
