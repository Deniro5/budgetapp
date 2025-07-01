import styled from "styled-components";
import { Flex } from "styles";
import { COLORS, SPACING } from "theme";

type BalanceSummaryFooterProps = {
  currentBalance?: number;
  afterBalance?: number;
};

export default function BalanceSummaryFooter({
  currentBalance,
  afterBalance,
}: BalanceSummaryFooterProps) {
  return (
    <Container>
      <SubContainer>
        <Label> Current Balance:</Label>
        {currentBalance ? `$${currentBalance}` : "N/A"}
      </SubContainer>
      <SubContainer>
        <Label> Balance After:</Label>
        {afterBalance ? `$${afterBalance}` : "N/A"}
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
