import React, { useState } from "react";
import PopoverContent from "../Global/PopoverContent";
import { BaseInput } from "styles";
import styled from "styled-components";
import { Popover } from "react-tiny-popover";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  function: () => void;
}

interface SearchDropdownProps {
  value: string;
  setValue: (value: string) => void;
  items: MenuItem[];
  selected: string | null;
  placeholder: string;
  width?: number;
}

export const SearchDropdown = ({
  value,
  setValue,
  items,
  selected,
  placeholder,
  width,
}: SearchDropdownProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasSearchResults = items && items.length > 0;

  const handleFocus = () => setIsFocused(true);

  return (
    <Popover
      isOpen={isFocused && hasSearchResults}
      positions={["bottom"]}
      padding={4}
      containerStyle={{ zIndex: "1100" }}
      onClickOutside={() => setIsFocused(false)}
      content={
        <PopoverContent
          width={width}
          menuItems={items}
          onClose={() => setIsFocused(false)}
        />
      }
    >
      <DropdownInput
        type="text"
        placeholder={placeholder}
        value={isFocused ? value : selected || ""}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
      />
    </Popover>
  );
};

const DropdownInput = styled(BaseInput)`
  width: 100%;
`;
