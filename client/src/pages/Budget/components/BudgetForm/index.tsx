import { useForm } from "react-hook-form";
import styled from "styled-components";
import { BaseButton, BaseInput, InputContainer, InputLabel } from "styles";
import { SPACING } from "theme";
import { BudgetCategories } from "types/budget";
import { transactionCategoryNameMap } from "constants/transactionCategoryNameMap";
import { TransactionCategory } from "types/Transaction";
import { getTotalBudget } from "store/budget/budgetSelectors";

type BudgetProps = {
  initialBudgetCategories: BudgetCategories;
  onSubmit: (transaction: BudgetCategories) => void;
};

export default function BudgetForm({
  initialBudgetCategories,
  onSubmit,
}: BudgetProps) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<BudgetCategories>({
    mode: "onSubmit", // Validation only on submit
    reValidateMode: "onSubmit", // No revalidation on field changes
    defaultValues: initialBudgetCategories,
  });

  const totalBudget = getTotalBudget();

  const onSubmitForm = (data: BudgetCategories) => {
    onSubmit(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <FormContainer>
          {Object.keys(initialBudgetCategories).map((budgetItem) => {
            const category = budgetItem as TransactionCategory;
            return (
              <InputContainer key={category}>
                <InputLabel>{transactionCategoryNameMap[category]}:</InputLabel>
                <BaseInput
                  type="number"
                  {...register(category, {
                    validate: (value) => !isNaN(value) || "Invalid number",
                    onChange: () => clearErrors(category),
                  })}
                />
              </InputContainer>
            );
          })}
        </FormContainer>
        <p>
          {" "}
          Total Monthly Budget: <b>{totalBudget}</b>{" "}
        </p>
        <ButtonContainer>
          <BaseButton type="submit">Save Changes</BaseButton>
        </ButtonContainer>
      </form>
    </>
  );
}

const ButtonContainer = styled.div`
  display: flex;

  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;

const FormContainer = styled.div`
  display: flex;

  flex-wrap: wrap;
  gap: ${SPACING.spacing4x};
`;
