import styled from "styled-components";
import { COLORS, SPACING } from "../../../Theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

type TransactionTableAddRowProps = {
  handleClick: () => void;
};

function TransactionTableAddRow({ handleClick }: TransactionTableAddRowProps) {
  return (
    <Container>
      <td onClick={() => handleClick()}>
        <FontAwesomeIcon icon={faAdd} /> Add New Transaction
      </td>
    </Container>
  );
}

//Todo remove this style and use the one from the transaction table row
const Container = styled.tr`
  color: ${COLORS.font};
  font-weight: 500;
  border-bottom: 1px solid ${COLORS.mediumGrey};

  cursor: pointer;
  &:hover {
    background: ${COLORS.lightGrey};
    color: ${COLORS.calendarBlue};
  }
  td {
    text-align: center;
    padding: ${SPACING.spacing4x};
    border-left: none; /* Hide vertical borders */
    border-right: none; /* Hide vertical borders */
  }
`;

export default TransactionTableAddRow;
