import { useState } from "react";

type useSearchDropdownProps<T> = {
  items: T[];
  itemToString: (item: T) => string;
};

export const useSearchDropdown = <T>({
  items,
  itemToString,
}: useSearchDropdownProps<T>) => {
  const [input, setInput] = useState("");

  const results = input.length
    ? items.filter((item) => {
        const stringItem = itemToString(item);
        if (typeof stringItem === "string") {
          return stringItem.toLowerCase().includes(input.toLowerCase().trim());
        }
        return false;
      })
    : [];

  const clearInput = () => {
    setInput("");
  };

  return {
    input,
    setInput,
    results,
    clearInput,
  };
};
