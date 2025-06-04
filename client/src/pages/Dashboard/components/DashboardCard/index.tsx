import React from "react";
import styled from "styled-components";
import { Card } from "styles";
import { COLORS, FONTSIZE, SPACING } from "theme";

type DashboardCardProps = {
  children: React.ReactNode;
  name?: string;
};
export default function DashboardCard({ children, name }: DashboardCardProps) {
  return (
    <Container>
      {name && <Name> {name}</Name>}
      {children}
    </Container>
  );
}

const Container = styled(Card)`
  height: 100%;
  padding: ${SPACING.spacing6x};
  width: 100%;
  overflow: hidden;
`;
const Name = styled.h3`
  margin-top: 0;
  font-size: ${FONTSIZE.lg};
  margin-bottom: ${SPACING.spacing6x};
`;
