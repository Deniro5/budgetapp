import styled from "styled-components";
import { COLORS, SPACING } from "../../../Theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

type TransactionTableAddRowProps = {
  handleClick: () => void;
};

function TransactionTableAddRow({ handleClick }: TransactionTableAddRowProps) {
  return (
    <StyledRow onClick={() => handleClick()}>
      <td>
        <FontAwesomeIcon icon={faAdd} /> Add New Transaction
      </td>
      <td colSpan={5}></td>
    </StyledRow>
  );
}

//Todo remove this style and use the one from the transaction table row
const StyledRow = styled.tr`
  color: ${COLORS.font};
  font-weight: 600;
  box-shadow: 0 1px 0 0 #ebebeb; //hacky way to keep the border sticky
  background: ${COLORS.pureWhite};
  position: sticky;

  top: 48px;

  cursor: pointer;
  &:hover {
    background: ${COLORS.lightGrey};
    color: ${COLORS.calendarBlue};
  }
  td {
    text-align: center;
    padding: ${SPACING.spacing4x};
  }
`;

export default TransactionTableAddRow;
