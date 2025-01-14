import React, { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import styled from "styled-components";
import { COLORS } from "../../../Theme";

type TagInputProps = {
  selected: string[];
  onChange: (tags: string[]) => void;
};

const TagInput = ({ selected, onChange }: TagInputProps) => {
  return (
    <Container>
      <TagsInput
        value={selected}
        onChange={onChange}
        name="tags"
        placeHolder="Enter Tags"
        separators={[" "]}
      />
    </Container>
  );
};

const Container = styled.div`
  .rti--container {
    background: ${COLORS.lightGrey};
  }
  .rti--input {
    background: ${COLORS.lightGrey};
  }
  .rti--tag {
    background: ${COLORS.primary};
    color: ${COLORS.pureWhite};
    button {
      color: ${COLORS.pureWhite};
    }
  }
`;

export default TagInput;
