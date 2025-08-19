import { Flex, PageContainer, PageTitle } from "styles";
import styled from "styled-components";
import { SPACING } from "theme";
import BudgetForm from "./components/BudgetForm";
import { BudgetCategories } from "types/budget";
import { useUpdateBudget } from "./hooks/useUpdateBudget";
import { useBudget } from "./hooks/useBudget";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader";

export default function Budget() {
  const { mutate } = useUpdateBudget();
  const { budget, isLoading, error, getTotalBudget } = useBudget();

  const handleSubmit = (newBudgetCategories: BudgetCategories) => {
    mutate({ budgetCategories: newBudgetCategories });
  };

  const getPageContent = () => {
    if (isLoading) return <SkeletonLoader rows={1} columns={1} height={500} />;
    if (error) return <div>Failed to load budget. Please refresh the page</div>;
    if (!budget) return <div>No budget found</div>;

    return (
      <ContentContainer>
        {budget.budgetCategories && (
          <BudgetForm
            initialBudgetCategories={budget.budgetCategories}
            onSubmit={handleSubmit}
            budgetTotal={getTotalBudget()}
          />
        )}
      </ContentContainer>
    );
  };

  return (
    <PageContainer>
      <PageTitle> Budget </PageTitle>
      <PageColumnFlexContainer>{getPageContent()}</PageColumnFlexContainer>
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
