import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "../../../Theme";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  BaseButton,
  DeleteButton,
  Divider,
  SecondaryButton,
} from "../../../Styles";
import { Transaction } from "../../../types/transaction";
import { format } from "date-fns";
import { getSelectedTransactionById } from "../../../zustand/transaction/transactionSelectors";
import { TransactionOverlayType } from "../../../pages/Transactions";

type TransactionSidebarProps = {
  transactionId: string | null;
  setActiveTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
};

const TransactionSidebar = ({
  transactionId,
  setActiveTransaction,
  setActiveOverlay,
}: TransactionSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const selectedTransaction = getSelectedTransactionById(transactionId);

  const toggleExpanded = () => setIsExpanded((isExpanded) => !isExpanded);

  const handleEditClick = () => {
    if (!selectedTransaction) return;
    setActiveTransaction(selectedTransaction);
    setActiveOverlay(TransactionOverlayType.EDIT);
  };

  const handleDeleteClick = () => {
    if (!selectedTransaction) return;
    setActiveTransaction(selectedTransaction);
    setActiveOverlay(TransactionOverlayType.DELETE);
  };

  const getSidebarContent = () => {
    return (
      <>
        <SidebarHeader>
          Transaction Details
          <IconContainer onClick={toggleExpanded}>
            <FontAwesomeIcon
              width={8}
              height={8}
              color={COLORS.lightFont}
              icon={isExpanded ? faChevronRight : faChevronLeft}
            />
          </IconContainer>
        </SidebarHeader>
        {selectedTransaction ? (
          <>
            <Row>
              <b> Name: </b> <span> {selectedTransaction.name} </span>
            </Row>
            <Row>
              <b> Vendor: </b> <span> {selectedTransaction.vendor} </span>
            </Row>
            <Row>
              <b> Date: </b> <span> {selectedTransaction.date} </span>
            </Row>
            <Row>
              <b> Amount: </b> <span> ${selectedTransaction.amount} </span>
            </Row>
            <Row>
              <b> Type: </b> <span> {selectedTransaction.type} </span>
            </Row>
            <Divider />
            <Row>
              <b> Category: </b> <span> {selectedTransaction.category} </span>
            </Row>
            <Row>
              <b> Tags: </b> <span> Loan, Test, Borrow</span>
            </Row>
            <Divider />
            <Row>
              <b> Created: </b>{" "}
              <span>
                {" "}
                {format(selectedTransaction.createdAt, "MM/dd/yyyy")}{" "}
              </span>
            </Row>
            <Row>
              <b> Updated: </b>{" "}
              <span>
                {" "}
                {format(selectedTransaction.updatedAt, "MM/dd/yyyy")}{" "}
              </span>
            </Row>
            <ButtonContainer>
              <BaseButton onClick={handleEditClick}>
                {" "}
                Edit Transaction{" "}
              </BaseButton>
              <DeleteButton onClick={handleDeleteClick}>
                Delete Transaction
              </DeleteButton>
            </ButtonContainer>
          </>
        ) : (
          <> Click a transaction to view </>
        )}
      </>
    );
  };

  return (
    <SidebarContainer>
      {!isExpanded ? (
        <IconContainer onClick={toggleExpanded}>
          <FontAwesomeIcon
            width={8}
            height={8}
            color={COLORS.lightFont}
            icon={isExpanded ? faChevronRight : faChevronLeft}
          />
        </IconContainer>
      ) : (
        getSidebarContent()
      )}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  border: 1px solid ${COLORS.mediumGrey};
  padding: ${SPACING.spacing6x} ${SPACING.spacing8x};
  width: fit-content;
  border-radius: 4px;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  gap: ${SPACING.spacing6x};
  font-size: ${FONTSIZE.lg};
  font-weight: 600;
  color: ${COLORS.pureBlack};
  margin-bottom: ${SPACING.spacing3x};
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: ${SPACING.spacing3x} 0;
  gap: ${SPACING.spacing2x};
  p {
    margin: 0;
  }
`;

const IconContainer = styled.div`
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${SPACING.spacing4x};
  margin-top: ${SPACING.spacing9x};
`;

export default TransactionSidebar;
