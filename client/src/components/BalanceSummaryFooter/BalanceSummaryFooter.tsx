import styled from "styled-components";
import { Flex } from "styles";
import { COLORS, SPACING } from "theme";
import { Account } from "types/account";
import { TransactionType } from "types/Transaction";
import { formatToCurrency } from "utils";

type BalanceSummaryFooterProps = {
  account?: Account;
  initialAccountId?: string;
  amount: number;
  initialAmount?: number;
  type: TransactionType;
  initialType?: TransactionType;
};

export default function BalanceSummaryFooter({
  account,
  initialAccountId,
  initialAmount,
  amount,
  type,
  initialType,
}: BalanceSummaryFooterProps) {
  if (!account) return null;

  const getParsedInitialAmount = () => {
    if (account._id !== initialAccountId) return 0;

    return (
      Number(initialAmount || 0) *
      (initialType === TransactionType.EXPENSE ? -1 : 1)
    );
  };

  const currentBalance = account.balance;

  const parsedAmount = Number(
    type === TransactionType.EXPENSE ? -amount : amount
  );

  const parsedInitialAmount = getParsedInitialAmount();

  //current balance minus the amount of the transaction or the change in the transaction if there is an initial
  const afterBalance = currentBalance
    ? currentBalance - (parsedInitialAmount - parsedAmount)
    : undefined;

  return (
    <Container>
      <SubContainer>
        <Label> Current Balance:</Label>
        {currentBalance ? `${formatToCurrency(currentBalance)}` : "N/A"}
      </SubContainer>
      <SubContainer>
        <Label> Balance After:</Label>
        {afterBalance ? `${formatToCurrency(afterBalance)}` : "N/A"}
      </SubContainer>
    </Container>
  );
}

const Container = styled(Flex)`
  margin-top: ${SPACING.spacing4x};
  border-radius: 4px;
  background-color: ${COLORS.lightPrimary};
  padding: 24px;
  gap: ${SPACING.spacing10x};
`;

const SubContainer = styled(Flex)`
  gap: ${SPACING.spacing2x};
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 16px;
`;
