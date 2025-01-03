import styled from "styled-components";
import { SPACING } from "../../../Theme";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton, BaseInput } from "../../../Styles";
import { ChangeEvent, useEffect, useState } from "react";

type TransactionSearchBarProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

function TransactionsSearchBar({
  search,
  setSearch,
}: TransactionSearchBarProps) {
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

export default TransactionsSearchBar;
