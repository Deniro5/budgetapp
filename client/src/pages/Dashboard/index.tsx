import { Flex, PageTitle } from "../../styles.ts";
import styled from "styled-components";
import { SPACING } from "theme";
import DashboardCard from "./components/DashboardCard/index.tsx";
import IncomeExpenseWidget from "./components/widgets/IncomeExpenseWidget/index.tsx";
import RecentTransactionsWidget from "./components/widgets/RecentTransactionsWidget/index.tsx";
import useDashboard from "../../pages/Dashboard/hooks/useDashboard.ts";
import useCalendar from "../../hooks/useCalendar.ts";
import DateMenu from "components/DateMenu/index.tsx";
import CategoryLineWidget from "./components/widgets/CategoryLineWidget/index.tsx";
import BudgetWidget from "./components/widgets/BudgetWidget/index.tsx";
import AccountWidget from "./components/widgets/AccountWidget/index.tsx";

function DashboardPage() {
  const { startDate, setStartDate, endDate, setEndDate } = useCalendar();
  const {
    categoryWidgetCategory,
    setCategoryWidgetCategory,
    accountWidgetId,
    setAccountWidgetId,
  } = useDashboard({
    startDate,
    endDate,
  });

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
            <AccountWidget id={accountWidgetId} setId={setAccountWidgetId} />
          </DashboardCard>
        </Column>
        <Column gridArea={"income"}>
          <DashboardCard>
            <IncomeExpenseWidget />
          </DashboardCard>
        </Column>
        <Column gridArea={"budget"}>
          <DashboardCard>
            <BudgetWidget startDate={startDate} endDate={endDate} />
          </DashboardCard>
        </Column>
        <Column gridArea="categoryline">
          <DashboardCard>
            <CategoryLineWidget
              category={categoryWidgetCategory}
              setCategory={setCategoryWidgetCategory}
              startDate={startDate}
              endDate={endDate}
            />
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
}

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

export default DashboardPage;
