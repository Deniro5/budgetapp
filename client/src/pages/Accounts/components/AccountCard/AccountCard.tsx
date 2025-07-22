import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import {
  BaseButton,
  Card,
  DeleteButton,
  Divider,
  Flex,
  SecondaryButton,
} from "styles";
import { FONTSIZE, SPACING } from "theme";
import { Account } from "types/account";
import { AccountOverlayType } from "../../AccountPage";

type AccountCardProps = {
  account: Account;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<AccountOverlayType | null>
  >;
  setActiveAccount: React.Dispatch<React.SetStateAction<Account | null>>;
};

export function AccountCard({
  account,
  setActiveAccount,
  setActiveOverlay,
}: AccountCardProps) {
  const handleViewClick = () => {
    setActiveOverlay(AccountOverlayType.VIEW);
    setActiveAccount(account);
  };
  const handleEditClick = () => {
    setActiveOverlay(AccountOverlayType.EDIT);
    setActiveAccount(account);
  };
  const handleDeleteClick = () => {
    setActiveOverlay(AccountOverlayType.DELETE);
    setActiveAccount(account);
  };

  const assetTotal = account.investmentSummary.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <Container>
      <AccountHeader>
        <AccountHeaderText>{account.name}</AccountHeaderText>
        <AccountHeaderText>${assetTotal + account.balance}</AccountHeaderText>
      </AccountHeader>
      <StyledDivider />
      <AccountInfo>
        <Flex>
          <Label> Balance: </Label>

          <Text> ${account.balance} </Text>
        </Flex>
        <Flex>
          <Label> Asset Total: </Label>

          <Text> ${assetTotal} </Text>
        </Flex>
        <Flex>
          <Label>Institution: </Label>
          <Text> {account.institution} </Text>
        </Flex>
        <Flex>
          <Label>Type: </Label>
          <Text> {account.type} </Text>
        </Flex>
      </AccountInfo>
      <ButtonContainer>
        <BaseButton onClick={handleViewClick}>
          <FontAwesomeIcon icon={faEye} />
          View Details
        </BaseButton>
        <SecondaryButton onClick={handleEditClick}>
          <FontAwesomeIcon icon={faPencil} />
          Edit Account
        </SecondaryButton>
        <DeleteButton onClick={handleDeleteClick}>
          {" "}
          <FontAwesomeIcon icon={faTrash} /> Delete Account{" "}
        </DeleteButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled(Card)`
  padding: ${SPACING.spacing6x};
`;

const StyledDivider = styled(Divider)`
  margin: ${SPACING.spacing3x} 0;
`;

const AccountInfo = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing3x};
  margin-left: ${SPACING.spacingBase};
`;

const Label = styled.h3`
  font-size: ${FONTSIZE.lg};
  font-weight: 600;
  width: 140px;
  margin: 0;
`;

const Text = styled.p`
  margin: 0;
`;

const AccountHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AccountHeaderText = styled.h2`
  margin: 0;
  font-size: ${FONTSIZE.ml};
`;

const ButtonContainer = styled(Flex)`
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
`;
