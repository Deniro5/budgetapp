import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { BaseButton, DeleteButton, Divider } from "styles";
import {
  PresetTransaction,
  Transaction,
  TransactionCategory,
} from "types/Transaction";
import { format } from "date-fns";

import { TransactionOverlayType, View } from "../../../TransactionsPage";
import { formatToCurrency } from "utils";

import useAccountStore from "store/account/accountStore";

type TransactionSidebarProps = {
  activeTransaction: Transaction | PresetTransaction | null;
  setActiveTransaction: React.Dispatch<
    React.SetStateAction<Transaction | PresetTransaction | null>
  >;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
  view: View;
};

export const TransactionSidebar = ({
  activeTransaction,
  setActiveOverlay,
  view,
}: TransactionSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { accountIdToNameMap } = useAccountStore();
  const sidebarTransaction = activeTransaction;
  const isTransfer =
    sidebarTransaction?.category === TransactionCategory.Transfer;

  const toggleExpanded = () => setIsExpanded((isExpanded) => !isExpanded);

  const handleEditClick = () => {
    if (!sidebarTransaction) return;
    if (view === "Preset") setActiveOverlay(TransactionOverlayType.EDIT_PRESET);
    else {
      setActiveOverlay(
        isTransfer
          ? TransactionOverlayType.EDIT_TRANSFER
          : TransactionOverlayType.EDIT
      );
    }
  };

  const handleDeleteClick = () => {
    if (!sidebarTransaction) return;
    if (view === "Preset")
      setActiveOverlay(TransactionOverlayType.DELETE_PRESET);
    else {
      setActiveOverlay(TransactionOverlayType.DELETE);
    }
  };

  const transactionVendorName =
    sidebarTransaction?.category === TransactionCategory.Transfer
      ? accountIdToNameMap[sidebarTransaction?.vendor || ""]
      : sidebarTransaction?.vendor;

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
              <b> Vendor: </b> <span> {transactionVendorName} </span>
            </Row>
            <Row>
              <b> Vendor: </b> <span> {transactionVendorName} </span>
            </Row>
            <Row>
              <b> Date: </b> <span> {sidebarTransaction.date} </span>
            </Row>
            <Row>
              <b> Account: </b> <span>{sidebarTransaction?.account?.name}</span>
            </Row>
            <Row>
              <b> Amount: </b>{" "}
              <span>{formatToCurrency(sidebarTransaction?.amount || 0)}</span>
            </Row>
            <Row>
              <b> Type: </b> <span> {sidebarTransaction.type} </span>
            </Row>
            <Row>
              <b> Category: </b> <span> {sidebarTransaction.category} </span>
            </Row>
            <Divider />
            {!isTransfer && (
              <>
                <Row>
                  <b> Tags: </b>{" "}
                  {sidebarTransaction.tags &&
                    sidebarTransaction.tags.map((tag) => <span> {tag} </span>)}
                </Row>
                <Row>
                  <b> Description: </b>{" "}
                  <span> {sidebarTransaction.description} </span>
                </Row>
                <Divider />
              </>
            )}
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
                Edit {isTransfer ? "Transfer" : "Transaction"}
              </BaseButton>
              <DeleteButton onClick={handleDeleteClick}>
                Delete {isTransfer ? "Transfer" : "Transaction"}
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
    <SidebarContainer isExpanded={isExpanded}>
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

const SidebarContainer = styled.div<{ isExpanded: boolean }>`
  background: ${COLORS.pureWhite};
  border: 1px solid ${COLORS.mediumGrey};
  padding: ${SPACING.spacing6x} ${SPACING.spacing8x};
  width: ${({ isExpanded }) => (isExpanded ? "280px" : "fit-content")};
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
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
