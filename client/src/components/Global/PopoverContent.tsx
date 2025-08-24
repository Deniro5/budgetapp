import styled from "styled-components";
import { COLORS, SPACING } from "theme";
import React from "react";

type MenuItem = {
  label: string;
  function: () => void;
};

type PopoverContentProps = {
  menuItems?: MenuItem[];
  children?: React.ReactNode;
  width?: number;
};

function PopoverContent({
  menuItems,
  children,
  width = 180,
}: PopoverContentProps) {
  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    callback: () => void
  ) => {
    callback();
    e.stopPropagation();
  };

  const getPopoverContent = () => {
    if (menuItems) {
      return menuItems.map((menuItem) => (
        <PopoverMenuItem
          key={menuItem.label}
          onClick={(e) => handleClick(e, menuItem.function)}
        >
          {menuItem.label}
        </PopoverMenuItem>
      ));
    } else {
      return children;
    }
  };

  return (
    <PopoverContentContainer $width={width}>
      {getPopoverContent()}
    </PopoverContentContainer>
  );
}

const PopoverContentContainer = styled.div<{ $width: number }>`
  background: ${COLORS.pureWhite};
  border: 1px solid ${COLORS.darkGrey};
  color: ${COLORS.font};
  width: ${({ $width }) => $width}px;
  border-radius: 4px;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: hidden;
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
