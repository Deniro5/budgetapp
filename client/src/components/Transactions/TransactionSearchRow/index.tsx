import styled from "styled-components";
import { SPACING } from "../../../Theme";
import {
  faFilter,
  faAngleDown,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton, BaseInput } from "../../../Styles";
import TransactionDateRange from "./TransactionDateRange";

function TransactionsSearchRow() {
  return (
    <Container>
      <SearchBarContainer>
        <SearchBar placeholder="Search Transactions" />
        <SearchButton>
          <FontAwesomeIcon icon={faSearch} />
        </SearchButton>
      </SearchBarContainer>
      <BaseButton>
        <FontAwesomeIcon icon={faFilter} />
        Filter
        <FontAwesomeIcon icon={faAngleDown} />
      </BaseButton>
      <TransactionDateRange />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: ${SPACING.spacing6x};
  margin-top: ${SPACING.spacing9x};
`;

const SearchBarContainer = styled.div`
  display: flex;
  flex: 1;
`;

const SearchBar = styled(BaseInput)`
  flex: 1;
`;

const SearchButton = styled(BaseButton)`
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
`;

export default TransactionsSearchRow;
