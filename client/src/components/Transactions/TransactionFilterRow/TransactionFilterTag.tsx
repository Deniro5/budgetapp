import styled from "styled-components";
import { SecondaryButton } from "../../../Styles";
import { COLORS } from "../../../Theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

type TransactionFilterTagProps = {
  name: string;
};

function TransactionFilterTag({ name }: TransactionFilterTagProps) {
  return (
    <Tag>
      {name} <FontAwesomeIcon icon={faClose} height={16} width={16} />
    </Tag>
  );
}

const Tag = styled(SecondaryButton)`
  border-color: ${COLORS.darkGrey};
`;

export default TransactionFilterTag;
