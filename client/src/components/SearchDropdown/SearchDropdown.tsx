// Import dependencies
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Popover } from "react-tiny-popover";
import PopoverContent from "../Global/PopoverContent";

import { BaseInput } from "styles";

// Define props interface
interface DropdownListProps<T> {
  value: string;
  setValue: (value: string) => void;
  items: T[];
  selected: T | null;
  placeholder: string;
  onSelect: (item: T) => void;
  itemRenderer?: (item: T) => React.ReactNode;
  itemToString: (item: T) => string;
  width?: number;
}

// Dropdown component
export const SearchDropdown = <T,>({
  value,
  setValue,
  items,
  selected,
  placeholder,
  onSelect,
  itemRenderer,
  itemToString,
  width = 200,
}: DropdownListProps<T>) => {
  const [hasFocus, setHasFocus] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: T
  ) => {
    setValue("");
    setHasFocus(false);
    onSelect(item);
  };

  const hasSearchResults = items && items.length > 0;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setHasFocus(false);
  };

  return (
    <>
      <Popover
        isOpen={hasSearchResults && hasFocus}
        positions={"bottom"}
        padding={4}
        containerStyle={{ zIndex: "1100" }}
        content={
          <PopoverContent width={width}>
            <ScrollableContainer>
              {hasSearchResults ? (
                items.map((item, index) => (
                  <Item key={index} onMouseDown={(e) => handleSelect(e, item)}>
                    {itemRenderer && itemRenderer(item)}
                  </Item>
                ))
              ) : (
                <NoItems>No items found</NoItems>
              )}
            </ScrollableContainer>
          </PopoverContent>
        }
      >
        <BaseInput
          type="text"
          placeholder={placeholder}
          value={value || (selected && itemToString(selected)) || ""}
          onChange={(e) => setValue(e.target.value)}
          ref={searchRef}
          onFocus={() => setHasFocus(true)}
          onBlur={handleBlur}
        />
      </Popover>
    </>
  );
};

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
