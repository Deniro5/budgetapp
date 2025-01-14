// Import dependencies
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS, SPACING } from "../../Theme";
import PopoverContent from "./PopoverContent";
import { Popover } from "react-tiny-popover";

// Define props interface
interface DropdownListProps {
  items: string[];
  selected: string;
  placeholder: string;
  onSelect: (item: string) => void;
  searchable?: boolean;
}

// Dropdown component
const DropdownList: React.FC<DropdownListProps> = ({
  items,
  selected,
  placeholder,
  onSelect,
  searchable,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (searchable) {
      setFilteredItems(
        items.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, items, searchable]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (item: string) => {
    onSelect(item);
    setIsOpen(false);
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
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
          <PopoverContent width={200}>
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
                filteredItems.map((item) => (
                  <Item key={item} onClick={() => handleSelect(item)}>
                    {item}
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
          {selected || placeholder}
          <Arrow>▼</Arrow>
        </SelectedItem>
      </Popover>
    </>
  );
};

const SelectedItem = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${COLORS.darkGrey};
  border-radius: 4px;
  cursor: pointer;
  color: ${COLORS.font}
  background: ${COLORS.lightGrey};
  font-size: 16px;
  height: 44px;
  padding: 0 ${SPACING.spacing3x};
`;

const Arrow = styled.span`
  margin-left: 10px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
`;

const Item = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const NoItems = styled.div`
  padding: 10px;
  color: #888;
`;

const ScrollableContainer = styled.div`
  max-height: 200px;
  overflow: scroll;
`;

export default DropdownList;
