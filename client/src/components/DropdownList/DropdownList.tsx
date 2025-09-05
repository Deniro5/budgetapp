import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { Popover } from "react-tiny-popover";
import PopoverContent from "../Global/PopoverContent";
import { useMenuFocus } from "hooks/useMenuFocus";

interface MenuItem {
  label: string;
  function: () => void;
}
interface DropdownListProps {
  items: MenuItem[];
  selected: string | null;
  placeholder: string;
  searchable?: boolean;
  width?: number;
}

const DropdownList = ({
  items,
  selected,
  placeholder,
  searchable,
  width = 200,
}: DropdownListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchable) return items;
    return items.filter((item) =>
      item?.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm, searchable]);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        positions={"bottom"}
        padding={4}
        onClickOutside={handleClose}
        containerStyle={{ zIndex: "1100" }}
        content={
          <>
            {searchable && (
              <SearchInput
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <PopoverContent
              width={width}
              menuItems={filteredItems}
              onClose={handleClose}
            />
          </>
        }
      >
        <SelectedItem onClick={handleButtonClick}>
          <SelectedItemText>{selected || placeholder}</SelectedItemText>
        </SelectedItem>
      </Popover>
    </>
  );
};

const SelectedItem = styled.button`
  display: flex;
  align-items: center;
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

const SelectedItemText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: ${SPACING.spacing4x};
  text-align: left;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  outline: none;
  border: 1px solid grey;
`;

export default DropdownList;
