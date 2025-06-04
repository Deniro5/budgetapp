import styled from "styled-components";
import { SecondaryButton } from "styles";
import { COLORS } from "theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

type TransactionFilterTagProps = {
  name: string;
  onClick: () => void;
};

function TransactionFilterTag({ name, onClick }: TransactionFilterTagProps) {
  const handleClick = () => onClick();

  return (
    <Tag onClick={handleClick}>
      {name} <FontAwesomeIcon icon={faClose} height={16} width={16} />
    </Tag>
  );
}

const Tag = styled(SecondaryButton)`
  border-color: ${COLORS.darkGrey};
`;

export default TransactionFilterTag;
