import styled from "styled-components";
import { COLORS } from "theme";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <ToggleWrapper>
      <SwitchLabel>
        <HiddenCheckbox
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <StyledSwitch $checked={checked} />
      </SwitchLabel>
      {label && <LabelText>{label}</LabelText>}
    </ToggleWrapper>
  );
}

const ToggleWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
`;

const HiddenCheckbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledSwitch = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ $checked }) => ($checked ? COLORS.primary : "#ccc")};
  border-radius: 22px;
  transition: background-color 0.2s;

  &::before {
    content: "";
    position: absolute;
    left: ${({ $checked }) => ($checked ? "18px" : "2px")};
    top: 2px;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    transition: left 0.2s;
  }
`;

const LabelText = styled.span`
  font-size: 14px;
  color: ${COLORS.font};
  font-weight: 500;
`;
