import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import React from "react";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  function: () => void;
}

type PopoverContentProps = {
  menuItems?: MenuItem[];
  children?: React.ReactNode;
  width?: number;
  onClose?: () => void;
};

const PopoverContent = ({
  menuItems,
  width = 180,
  onClose,
}: PopoverContentProps) => {
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    callback: () => void
  ) => {
    e.stopPropagation();
    callback();
    if (onClose) onClose();
  };

  const getPopoverContent = () => {
    if (menuItems && menuItems.length) {
      return menuItems.map((menuItem) => (
        <PopoverMenuItem
          key={menuItem.key}
          onClick={(e) => handleClick(e, menuItem.function)}
        >
          {menuItem.label}
        </PopoverMenuItem>
      ));
    } else {
      return <NoItems>No items found</NoItems>;
    }
  };

  return (
    <PopoverContentContainer $width={width}>
      {getPopoverContent()}
    </PopoverContentContainer>
  );
};

PopoverContent.displayName = "PopoverContent";

const PopoverContentContainer = styled.div<{ $width: number }>`
  background: ${COLORS.pureWhite};
  border: 1px solid ${COLORS.darkGrey};
  color: ${COLORS.font};
  width: ${({ $width }) => $width}px;
  border-radius: 4px;
  z-index: 1000;
  overflow: hidden;
  max-height: 220px;
  overflow: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  color: ${COLORS.font};
`;

const PopoverMenuItem = styled.button`
  background: transparent;
  &:hover {
    background: ${COLORS.lightGrey};
  }
  &:active {
    background: ${COLORS.mediumGrey};
  }
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
  font-size: ${FONTSIZE.md};
  padding: ${SPACING.spacing3x} ${SPACING.spacing2x};
  color: ${COLORS.font};
`;

const NoItems = styled.div`
  padding: ${SPACING.spacing3x};
`;

export default PopoverContent;
