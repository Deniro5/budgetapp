import styled from "styled-components";
import { COLORS, SPACING } from "../../Theme";

type MenuItem = {
  label: string;
  function: () => void;
};

type PopoverContentProps = {
  menuItems: MenuItem[];
};

function PopoverContent({ menuItems }: PopoverContentProps) {
  return (
    <PopoverContentContainer>
      {menuItems.map((menuItem) => (
        <PopoverMenuItem onClick={() => menuItem.function()}>
          {menuItem.label}
        </PopoverMenuItem>
      ))}
    </PopoverContentContainer>
  );
}

const PopoverContentContainer = styled.div`
  background: ${COLORS.pureWhite};
  border: 1px solid ${COLORS.mediumGrey};
  color: ${COLORS.font};
  width: 180px;
  border-radius: 4px;
`;

const PopoverMenuItem = styled.div`
  text-align: center;
  &:hover {
    background: ${COLORS.lightGrey};
  }
  &:active {
    background: ${COLORS.mediumGrey};
  }
  padding: ${SPACING.spacing3x};
  cursor: pointer;
`;

export default PopoverContent;
