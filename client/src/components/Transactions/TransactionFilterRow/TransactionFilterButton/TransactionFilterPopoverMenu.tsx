import PopoverContent from "../../../Global/PopoverContent";
import { SPACING } from "../../../../Theme";
import styled from "styled-components";
import {
  InputContainer,
  InputLabel,
  BaseSelect,
  BaseButton,
  SecondaryButton,
  BaseInput,
  Row,
} from "../../../../Styles";

function TransactionFilterPopoverMenu() {
  return (
    <PopoverContent width={480}>
      <Container>
        <Row>
          <InputContainer>
            <InputLabel>Min Amount</InputLabel>
            <BaseInput placeholder="Enter amount" />
          </InputContainer>
          <InputContainer>
            <InputLabel>Max Amount</InputLabel>
            <BaseInput placeholder="Enter type" />
          </InputContainer>
        </Row>

        <Row>
          <InputContainer>
            <InputLabel>Type</InputLabel>
            <BaseInput placeholder="Enter amount" />
          </InputContainer>
          <InputContainer>
            <InputLabel>Account</InputLabel>
            <BaseInput placeholder="Enter type" />
          </InputContainer>
        </Row>

        <Row>
          <InputContainer>
            <InputLabel>Categories</InputLabel>
            <BaseSelect>
              <option value="">Select category</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
            </BaseSelect>
          </InputContainer>
        </Row>

        <Row>
          <InputContainer>
            <InputLabel>Tags</InputLabel>
            <BaseSelect>
              <option value="">Select category</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
            </BaseSelect>
          </InputContainer>
        </Row>

        <ButtonContainer>
          <BaseButton>Update Filters</BaseButton>
          <SecondaryButton>Cancel</SecondaryButton>
        </ButtonContainer>
      </Container>
    </PopoverContent>
  );
}

const Container = styled.div`
  padding: ${SPACING.spacing6x};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;

export default TransactionFilterPopoverMenu;
