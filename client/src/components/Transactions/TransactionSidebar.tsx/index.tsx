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
import { Transaction } from "../types";
import { format } from "date-fns";
import { getTransactionById } from "../../../zustand/transaction/transactionSelectors";
import { TransactionOverlayType } from "../../../pages/Transactions";
import { getDollarValue } from "../../../utils";

type TransactionSidebarProps = {
  sidebarTransactionId: string | null;
  setActiveTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
};

const TransactionSidebar = ({
  sidebarTransactionId,
  setActiveTransaction,
  setActiveOverlay,
}: TransactionSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const sidebarTransaction = getTransactionById(sidebarTransactionId);

  const toggleExpanded = () => setIsExpanded((isExpanded) => !isExpanded);

  const handleEditClick = () => {
    if (!sidebarTransaction) return;
    setActiveTransaction(sidebarTransaction);
    setActiveOverlay(TransactionOverlayType.EDIT);
  };

  const handleDeleteClick = () => {
    if (!sidebarTransaction) return;
    setActiveTransaction(sidebarTransaction);
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
        {sidebarTransaction ? (
          <>
            <Row>
              <b> Vendor: </b> <span> {sidebarTransaction.vendor} </span>
            </Row>
            <Row>
              <b> Date: </b> <span> {sidebarTransaction.date} </span>
            </Row>
            <Row>
              <b> Account: </b> <span>{sidebarTransaction.account}</span>
            </Row>
            <Row>
              <b> Amount: </b>{" "}
              <span>{getDollarValue(sidebarTransaction.amount)}</span>
            </Row>
            <Row>
              <b> Type: </b> <span> {sidebarTransaction.type} </span>
            </Row>
            <Row>
              <b> Category: </b> <span> {sidebarTransaction.category} </span>
            </Row>
            <Divider />
            <Row>
              <b> Name: </b> <span> {sidebarTransaction.name} </span>
            </Row>

            <Row>
              <b> Tags: </b>{" "}
              {sidebarTransaction.tags.map((tag) => (
                <span> {tag} </span>
              ))}
            </Row>
            <Row>
              <b> Description: </b>{" "}
              <span> {sidebarTransaction.description} </span>
            </Row>
            <Divider />
            <Row>
              <b> Created: </b>{" "}
              <span>
                {" "}
                {format(sidebarTransaction.createdAt, "MM/dd/yyyy")}{" "}
              </span>
            </Row>
            <Row>
              <b> Updated: </b>{" "}
              <span>
                {" "}
                {format(sidebarTransaction.updatedAt, "MM/dd/yyyy")}{" "}
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
