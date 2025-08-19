// Import dependencies
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { Popover } from "react-tiny-popover";
import PopoverContent from "../Global/PopoverContent";
import DropdownListItem from "./DropdownListItem";

// Define props interface
interface DropdownListProps<T> {
  items: T[];
  selected: T | null;
  placeholder: string;
  onSelect: (item: T) => void;
  searchable?: boolean;
  itemRenderer?: (item: T) => React.ReactNode;
  width?: number;
  itemToString: (item: T) => string;
}

// Dropdown component
const DropdownList = <T,>({
  items,
  selected,
  placeholder,
  onSelect,
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
          const stringItem = itemToString(item);
          if (typeof stringItem === "string") {
            return stringItem.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        })
      );
    }
  }, [searchTerm, items, searchable, itemRenderer]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: T
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(item);
    setIsOpen(false);
  };

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
          <PopoverContent width={width}>
            {searchable && (
              <SearchInput
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            <ScrollableContainer>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <Item key={index} onClick={(e) => handleSelect(e, item)}>
                    {itemRenderer ? (
                      itemRenderer(item)
                    ) : (
                      <DropdownListItem>{itemToString(item)}</DropdownListItem>
                    )}
                  </Item>
                ))
              ) : (
                <NoItems>No items found</NoItems>
              )}
            </ScrollableContainer>
          </PopoverContent>
        }
      >
        <SelectedItem onClick={handleButtonClick}>
          <SelectedItemText>
            {" "}
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
  min-width: 90px;
  padding-right: ${SPACING.spacing2x};
  text-align: left;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
`;

const Item = styled.div`
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
  }
`;

const NoItems = styled.div`
  padding: 10px;
  color: #888;
`;

const ScrollableContainer = styled.div`
  max-height: 200px;
  overflow: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default DropdownList;
