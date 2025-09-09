import styled from "styled-components";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseInput } from "styles";
import { ChangeEvent, useEffect, useState } from "react";
import useTransactionStore from "store/transaction/transactionStore";
import { COLORS, SPACING } from "theme";

export function TransactionSearchBar() {
  const { search, setSearch } = useTransactionStore();
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <SearchBarContainer>
      <SearchBar
        placeholder="Search Transactions"
        value={inputValue}
        onChange={handleSearchChange}
      />
      <SearchIconContainer>
        <FontAwesomeIcon icon={faSearch} />
      </SearchIconContainer>
    </SearchBarContainer>
  );
}

const SearchBarContainer = styled.div`
  display: flex;
  flex: 1;
`;

const SearchBar = styled(BaseInput)`
  flex: 1;
`;

const SearchIconContainer = styled.div`
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  background-color: ${COLORS.primary};
  color: ${COLORS.pureWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${SPACING.spacing3x} ${SPACING.spacing4x};
`;
