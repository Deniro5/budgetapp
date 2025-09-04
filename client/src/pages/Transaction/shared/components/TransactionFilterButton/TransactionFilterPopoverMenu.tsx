import PopoverContent from "components/Global/PopoverContent";
import { COLORS, SPACING } from "theme";
import styled from "styled-components";
import {
  InputContainer,
  InputLabel,
  BaseSelect,
  BaseButton,
  SecondaryButton,
  BaseInput,
  Row,
} from "styles";
import { TransactionCategory, TransactionType } from "types/Transaction";
import { ChangeEvent, useState } from "react";
import TagInput from "components/Global/TagInput";
import AccountDropdown from "components/AccountDropdown/AccountDropdown";
import CategoryDropdown from "components/CategoryDropdown/CategoryDropdown";
import useTransactionStore from "store/transaction/transactionStore";

type TransactionFilterPopoverMenuProps = {
  handleClose: () => void;
};

function TransactionFilterPopoverMenu({
  handleClose,
}: TransactionFilterPopoverMenuProps) {
  const { filter, setFilter } = useTransactionStore();
  const [tempFilter, setTempFilter] = useState(filter);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    filterName: string
  ) => {
    setTempFilter({ ...tempFilter, [filterName]: e.target.value });
  };

  const handleTagInputChange = (tags: string[], filterName: string) => {
    setTempFilter({
      ...tempFilter,
      [filterName]: tags,
    });
  };

  const updateFilters = () => {
    setFilter(tempFilter);
    handleClose();
  };

  return (
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
          <BaseSelect
            name="type"
            value={tempFilter.type}
            onChange={(e) => handleFilterChange(e, "type")}
          >
            <option value="">Select Type</option>
            <option value={TransactionType.EXPENSE}>
              {TransactionType.EXPENSE}
            </option>
            <option value={TransactionType.INCOME}>
              {TransactionType.INCOME}
            </option>
          </BaseSelect>
        </InputContainer>
        <InputContainer>
          <InputLabel>Account</InputLabel>
          <AccountDropdown
            selectedAccountId={tempFilter.account || null}
            handleAccountChange={(account: string) =>
              handleFilterChange(
                {
                  target: { value: account },
                } as ChangeEvent<HTMLInputElement>,
                "account"
              )
            }
          />
        </InputContainer>
      </Row>

      <Row>
        <InputContainer>
          <InputLabel>Category</InputLabel>
          <CategoryDropdown
            selectedCategory={tempFilter.category || null}
            handleCategoryChange={(category: TransactionCategory) =>
              handleFilterChange(
                {
                  target: { value: category },
                } as ChangeEvent<HTMLInputElement>,
                "category"
              )
            }
          />
        </InputContainer>
      </Row>

      <InputContainer>
        <InputLabel>Tags</InputLabel>
        <TagInput
          value={tempFilter.tags || []}
          setValue={(tags: string[]) => handleTagInputChange(tags, "tags")}
        />
      </InputContainer>
      <ButtonContainer>
        <BaseButton onClick={updateFilters}>Update Filters</BaseButton>
        <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: ${SPACING.spacing6x};
  background: ${COLORS.pureWhite};
  border: 1px solid ${COLORS.darkGrey};
  color: ${COLORS.font};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;

export default TransactionFilterPopoverMenu;
