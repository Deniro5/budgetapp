import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "./theme";

// -------------------- Containers --------------------------

export const Card = styled.div`
  background: ${COLORS.pureWhite};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.spacing6x};
`;

export const ScrollableContainer = styled.div`
  overflow: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// -------------------- Page Elements --------------------------

export const PageContainer = styled.div``;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: ${FONTSIZE.xl};
  color: ${COLORS.pureBlack};
`;

// -------------------- Buttons --------------------------

export const BaseButton = styled.button`
  background: ${COLORS.primary};
  border-radius: 4px;
  color: ${COLORS.pureWhite};
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
  cursor: pointer;

  &:disabled {
    background: ${COLORS.darkGrey}; /* or any other disabled color */
    cursor: not-allowed;
    opacity: 0.6; /* adjust opacity to indicate disabled state */
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: ${COLORS.pureWhite};
  color: ${COLORS.primary};
  border: 1px solid ${COLORS.primary};
  &:hover {
    background: ${COLORS.lightPrimary};
  }
  gap: ${SPACING.spacing2x};
`;

export const DeleteButton = styled(BaseButton)`
  background: ${COLORS.deleteRed};
  &:hover {
    background: ${COLORS.darkDeleteRed};
  }
`;

export const IconButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  &:hover {
    background: none;
  }
  color: ${COLORS.font};
  &:focus {
    outline: ${COLORS.lightPrimary};
  }
  &:hover {
    color: ${COLORS.primary};
  }
`;

// -------------------- Forms --------------------------

export const BaseInput = styled.input`
  background: ${COLORS.pureWhite};
  border: 1px solid ${COLORS.darkGrey};
  border-radius: 4px;
  height: 44px;
  padding: 0 ${SPACING.spacing3x};
  color: ${COLORS.font};
  font-size: ${FONTSIZE.md};
  &::placeholder {
    color: ${COLORS.lightFont};
  }
`;

export const BaseSelect = styled.select`
  border: 1px solid ${COLORS.darkGrey};
  border-radius: 4px;
  height: 44px;
  padding: 0 ${SPACING.spacing3x};
  color: ${COLORS.font};
  font-size: ${FONTSIZE.md};
  &::placeholder {
    color: ${COLORS.lightFont};
  }

  box-sizing: border-box;

  appearance: none; /* Remove native arrow */
  background: ${COLORS.pureWhite}
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23777' d='M0 0l5 6 5-6H0z'/%3E%3C/svg%3E")
    no-repeat right ${SPACING.spacing3x} center;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.spacing2x};
`;

export const InputLabel = styled.label`
  font-size: ${FONTSIZE.sm};
  font-weight: 600;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${SPACING.spacing4x};
  gap: 24px;

  ${InputContainer} {
    flex: 1;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid ${COLORS.darkGrey};
  margin: ${SPACING.spacing4x} 0;
`;

export const BaseCheckbox = styled.input`
  cursor: pointer;
`;

export const BaseCheckboxContainer = styled.label`
  display: flex;
  gap: ${SPACING.spacingBase};
  align-items: center;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font-size: ${FONTSIZE.sm}

  &:hover {
    color: ${COLORS.pureBlack};
  }
`;

export const ScrollablePageContainer = styled.div`
  overflow: scroll;
  scrollbar-width: none;
  padding-bottom: ${SPACING.spacingBase};
  &::-webkit-scrollbar {
    display: none;
  }
  height: calc(100vh - 136px);
`;

export const Tag = styled.div`
  background-color: ${COLORS.primary};
  color: ${COLORS.pureWhite};
  padding: ${SPACING.spacingBase} ${SPACING.spacing2x};
  border-radius: 6px;
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 4px;
  width: fit-content;
  font-weight: bold;
`;
