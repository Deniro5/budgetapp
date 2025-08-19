import styled from "styled-components";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton, BaseInput } from "styles";
import { ChangeEvent, useEffect, useState } from "react";
import useTransactionStore from "store/transaction/transactionStore";

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
      <SearchButton>
        <FontAwesomeIcon icon={faSearch} />
      </SearchButton>
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

const SearchButton = styled(BaseButton)`
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
`;
