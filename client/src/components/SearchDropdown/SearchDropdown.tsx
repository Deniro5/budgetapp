// Import dependencies
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Popover } from "react-tiny-popover";
import PopoverContent from "../Global/PopoverContent";

import { BaseInput } from "styles";

interface MenuItem {
  label: string;
  function: () => void;
}
// Define props interface
interface SearchDropdownProps {
  value: string;
  setValue: (value: string) => void;
  items: MenuItem[];
  selected: MenuItem | null;
  placeholder: string;
  width?: number;
  onSelect: (item: MenuItem) => void;
}

// Dropdown component
export const SearchDropdown = ({
  value,
  setValue,
  items,
  selected,
  placeholder,
  onSelect,
  width = 200,
}: SearchDropdownProps) => {
  const [hasFocus, setHasFocus] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: MenuItem
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setValue("");
    setHasFocus(false);
    onSelect(item);
  };

  const removeFocus = () => setHasFocus(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    removeFocus();
  };

  const hasSearchResults = items && items.length > 0;
  return (
    <>
      <Popover
        isOpen={hasSearchResults && hasFocus}
        positions={"bottom"}
        padding={4}
        containerStyle={{ zIndex: "1100" }}
        content={
          <PopoverContent
            width={width}
            menuItems={items}
            onClose={removeFocus}
          />
        }
      >
        <BaseInput
          type="text"
          placeholder={placeholder}
          value={hasFocus ? value : (selected && selected.label) || ""}
          onChange={(e) => setValue(e.target.value)}
          ref={searchRef}
          onFocus={() => setHasFocus(true)}
          onBlur={handleBlur}
        />
      </Popover>
    </>
  );
};
