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
import { TransactionFilter } from "../../../../types/transaction";
import { ChangeEvent, useState } from "react";

type TransactionFilterPopoverMenuProps = {
  filter: TransactionFilter;
  setFilter: React.Dispatch<React.SetStateAction<TransactionFilter>>;
  handleClose: () => void;
};

function TransactionFilterPopoverMenu({
  filter,
  setFilter,
  handleClose,
}: TransactionFilterPopoverMenuProps) {
  const [tempFilter, setTempFilter] = useState(filter);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement>,
    filterName: string
  ) => {
    setTempFilter({ ...tempFilter, [filterName]: e.target.value });
  };

  const updateFilters = () => {
    setFilter(tempFilter);
    handleClose();
  };

  return (
    <PopoverContent width={480}>
      <Container>
        <Row>
          <InputContainer>
            <InputLabel>Min Amount</InputLabel>
            <BaseInput
              value={tempFilter.minAmount}
              onChange={(e) => handleFilterChange(e, "minAmount")}
              placeholder="Enter amount"
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>Max Amount</InputLabel>
            <BaseInput
              value={tempFilter.maxAmount}
              onChange={(e) => handleFilterChange(e, "maxAmount")}
              placeholder="Enter type"
            />
          </InputContainer>
        </Row>

        <Row>
          <InputContainer>
            <InputLabel>Type</InputLabel>
            <BaseInput
              value={tempFilter.type}
              onChange={(e) => handleFilterChange(e, "type")}
              placeholder="Enter amount"
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>Account</InputLabel>
            <BaseInput
              value={tempFilter.account}
              onChange={(e) => handleFilterChange(e, "account")}
              placeholder="Enter type"
            />
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
          <BaseButton onClick={updateFilters}>Update Filters</BaseButton>
          <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
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
