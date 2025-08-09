import Modal from "components/Global/Modal";

import ConfirmModal from "components/Global/ConfirmModal";
import { Account } from "types/account";
import { SecondaryButton } from "styles";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEditAccount } from "../../hooks/useEditAccount";

type DeleteAccountButtonProps = {
  account: Account;
  onClose: () => void;
};

export function DeleteAccountModal({
  account,
  onClose,
}: DeleteAccountButtonProps) {
  const { mutate } = useEditAccount("Account archived successfully");
  const isBalanceZero = account.balance === 0;
  const isInvestmentZero = account.investmentSummary.length === 0;
  const isDeletable = isBalanceZero && isInvestmentZero;

  const handleConfirm = () => {
    mutate({
      accountId: account._id,
      updatedAccount: { ...account, isArchived: true },
    });
    onClose();
  };

  const getStatusIcon = (status: boolean) => {
    if (status) {
      return <FontAwesomeIcon icon={faCheck} color={COLORS.green} />;
    } else {
      return <FontAwesomeIcon icon={faTimes} color={COLORS.deleteRed} />;
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      {isDeletable ? (
        <ConfirmModal
          handleCancel={onClose}
          handleConfirm={handleConfirm}
          text="Are you sure you want to archive this Account?"
        />
      ) : (
        <SecondStepContainer>
          <Title> Unable to delete account </Title>
          <p>
            In order to delete this account you will need to set its balance and
            its investments to zero. The recommended way to do this is by first
            selling any remaining investments and then doing a transfer of the
            remaining balance to another account.
          </p>

          <StatusRow>
            {getStatusIcon(isBalanceZero)}
            Account balance is zero
          </StatusRow>
          <StatusRow>
            {getStatusIcon(isInvestmentZero)}
            This account as no investments
          </StatusRow>

          <ButtonContainer>
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          </ButtonContainer>
        </SecondStepContainer>
      )}
    </Modal>
  );
}

const SecondStepContainer = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;

const Title = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: ${SPACING.spacing6x};
  font-size: ${FONTSIZE.lg};
`;

const StatusRow = styled.div`
  display: flex;
  padding: ${SPACING.spacing2x} 0;
  gap: ${SPACING.spacing2x};
  align-items: center;
`;
