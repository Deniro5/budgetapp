import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "./Theme";

export const Card = styled.div`
  background: ${COLORS.pureWhite};
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

export const PageContainer = styled.div``;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: ${FONTSIZE.xl};
  color: ${COLORS.pureBlack};
`;

export const BaseButton = styled.button`
  background: ${COLORS.primary};
  border-radius: 4px;
  color: white;
  border: none;
  padding: ${SPACING.spacing3x} ${SPACING.spacing5x};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  &:hover {
    background: ${COLORS.darkPrimary};
  }
  gap: ${SPACING.spacing2x};
`;

export const BaseInput = styled.input`
  background: ${COLORS.lightGrey};
  border: 1px solid ${COLORS.mediumGrey};
  border-radius: 4px;
  height: 44px;
  padding: 0 ${SPACING.spacing3x};
  color: ${COLORS.font};
  font-size: ${FONTSIZE.md};
  &::placeholder {
    color: ${COLORS.lightFont};
  }
`;
