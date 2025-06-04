import React, { useState, useRef } from "react";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "../../../Theme";
import { BaseInput } from "../../../styles";
import { isAlpha } from "validator";

interface TagInputProps {
  value: string[];
  setValue: (tags: string[]) => void;
  placeholder?: string;
  validator?: (tag: string) => boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  value,
  setValue,
  placeholder = "Add Tags..",
  validator = isAlpha,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  // Add a new tag when Enter or Space is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue) {
      // Remove the last tag if input is empty
      removeLastTag();
    }
  };

  // Function to remove the last tag
  const removeLastTag = () => {
    if (value.length > 0) {
      setValue(value.slice(0, -1));
    }
  };
  // Add a tag on blur
  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  // Function to add a tag to the parent value and clear the input
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag) && validator(tag)) {
      setValue([...value, trimmedTag]);
    }
    setInputValue("");
  };

  // Remove a tag from the list
  const removeTag = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tag: string
  ) => {
    e.stopPropagation();
    setValue(value.filter((t) => t !== tag));
  };

  return (
    <InputContainer>
      {value.map((tag, index) => (
        <Tag key={index}>
          {tag}
          <RemoveButton onClick={(e) => removeTag(e, tag)}>
            &times;
          </RemoveButton>
        </Tag>
      ))}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    </InputContainer>
  );
};

export default TagInput;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: ${SPACING.spacingBase} ${SPACING.spacing2x};
  padding-left: 0;
  border: 1px solid ${COLORS.darkGrey};
  border-radius: 4px;
  background-color: ${COLORS.pureWhite};
  &:focus-within {
    border-color: ${COLORS.primary};
  }
`;

const Tag = styled.div`
  background-color: ${COLORS.primary};
  color: ${COLORS.pureWhite};
  padding: ${SPACING.spacingBase} ${SPACING.spacing2x};
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 4px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: ${COLORS.pureWhite};
  padding: 0;
  margin-left: 4px;
`;

const Input = styled(BaseInput)`
  flex: 1;
  border: none;
  outline: none;
  font-size: ${FONTSIZE.md};
  min-width: 120px;
  background: none;
  height: 36px;

  &::placeholder {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }
`;
