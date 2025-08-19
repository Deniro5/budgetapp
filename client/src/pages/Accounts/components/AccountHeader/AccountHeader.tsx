import styled from "styled-components";
import { BaseButton, PageTitle } from "styles";
import { SPACING } from "theme";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AccountOverlayType } from "../../account.types";
type AccountsHeaderProps = {
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<AccountOverlayType | null>
  >;
};

export function AccountHeader({ setActiveOverlay }: AccountsHeaderProps) {
  const handleAddClick = () => {
    setActiveOverlay(AccountOverlayType.ADD);
  };

  return (
    <Container>
      <PageTitle>Accounts </PageTitle>
      <ButtonContainer>
        <BaseButton onClick={handleAddClick}>
          <FontAwesomeIcon icon={faAdd} />
          Add Account
        </BaseButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${SPACING.spacing6x};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${SPACING.spacing6x};
`;
