import { Flex, PageContainer, PageTitle } from "../../styles.ts";
import styled from "styled-components";
import { SPACING } from "theme";
import BudgetForm from "./components/BudgetForm/index.tsx";
import { BudgetCategories } from "types/budget.ts";
import useBudgetStore from "store/budget/budgetStore.ts";
import useBudget from "./hooks/useBudget.ts";

function Budget() {
  const { budget, updateBudget } = useBudgetStore();

  const handleSubmit = (newBudgetCategories: BudgetCategories) => {
    updateBudget({ budgetCategories: newBudgetCategories });
  };
  useBudget();

  return (
    <PageContainer>
      <PageTitle> Budget </PageTitle>
      <PageColumnFlexContainer>
        <ContentContainer>
          {budget.budgetCategories && (
            <BudgetForm
              initialBudgetCategories={budget.budgetCategories}
              onSubmit={handleSubmit}
            />
          )}
        </ContentContainer>
      </PageColumnFlexContainer>
    </PageContainer>
  );
}

const PageColumnFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.spacing6x};
  margin-top: ${SPACING.spacing9x};
`;

const ContentContainer = styled(Flex)`
  align-items: flex-start;
`;

export default Budget;
