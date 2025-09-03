import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { Popover } from "react-tiny-popover";
import PopoverContent from "../Global/PopoverContent";
import { useMenuFocus } from "hooks/useMenuFocus";

interface MenuItem {
  label: string;
  function: () => void;
}
interface DropdownListProps<T> {
  items: MenuItem[];
  selected: T | null;
  placeholder: string;
  searchable?: boolean;
  itemRenderer?: (item: T) => React.ReactNode;
  width?: number;
  itemToString: (item: T) => string;
}

const DropdownList = <T,>({
  items,
  selected,
  placeholder,
  searchable,
  itemRenderer,
  width = 200,
  itemToString,
}: DropdownListProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (searchable) {
      setFilteredItems(
        items.filter((item) => {
          if (!item?.label) return false;

          return item.label.toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
  }, [searchTerm, items, searchable, itemRenderer]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        positions={"bottom"}
        padding={4}
        onClickOutside={toggleDropdown}
        containerStyle={{ zIndex: "1100" }}
        content={
          <>
            {searchable && (
              <SearchInput
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            <PopoverContent
              width={width}
              menuItems={filteredItems}
              onClose={toggleDropdown}
            />
          </>
        }
      >
        <SelectedItem onClick={handleButtonClick}>
          <SelectedItemText>
            {selected ? itemToString(selected) : placeholder}
          </SelectedItemText>
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
