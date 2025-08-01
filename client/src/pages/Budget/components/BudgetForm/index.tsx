import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  BaseButton,
  BaseInput,
  InputContainer,
  InputLabel,
  SecondaryButton,
} from "styles";
import { SPACING } from "theme";
import { BudgetCategories } from "types/budget";

import { budgetOnlyCategories, TransactionCategory } from "types/Transaction";
import { formatToCurrency } from "utils";

type BudgetProps = {
  initialBudgetCategories: BudgetCategories;
  onSubmit: (transaction: BudgetCategories) => void;
  budgetTotal: number;
};

const defaultValues = budgetOnlyCategories.reduce((acc, cur) => {
  acc[cur as TransactionCategory] = 0;
  return acc;
}, {} as Record<TransactionCategory, number>);

export default function BudgetForm({
  initialBudgetCategories,
  onSubmit,
  budgetTotal,
}: BudgetProps) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch,
    reset,
  } = useForm<BudgetCategories>({
    mode: "onSubmit", // Validation only on submit
    reValidateMode: "onSubmit", // No revalidation on field changes
    defaultValues: {
      ...defaultValues,
      ...initialBudgetCategories,
    },
  });

  const currentValues = watch();

  const onSubmitForm = (data: BudgetCategories) => {
    onSubmit(data);
  };

  const newBudget = Object.values(currentValues).reduce(
    (acc, cur) => acc + Number(cur),
    0
  );

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <FormContainer>
          {Object.keys(defaultValues).map((budgetItem) => {
            const category = budgetItem as TransactionCategory;
            return (
              <InputContainer key={category}>
                <InputLabel>{category}:</InputLabel>
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
        <TotalsContainer>
          <p>
            Current Total Monthly Budget: <b>{formatToCurrency(budgetTotal)}</b>
          </p>
          |
          <p>
            New Total Monthly Budget: <b>{formatToCurrency(newBudget)}</b>
          </p>
        </TotalsContainer>
        <ButtonContainer>
          <BaseButton type="submit">Save Changes</BaseButton>
          <SecondaryButton onClick={handleReset}>
            Revert Changes
          </SecondaryButton>
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

const TotalsContainer = styled.div`
  display: flex;
  gap: ${SPACING.spacing4x};
  align-items: center;
`;
