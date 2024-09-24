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

const TransactionSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
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
          <Row>
            <b> Vendor: </b> <span> Walmart </span>
          </Row>
          <Row>
            <b> Date: </b> <span> Sept 26 2024 </span>
          </Row>
          <Row>
            <b> Amount: </b> <span> $120.00 </span>
          </Row>
          <Row>
            <b> Type: </b> <span> Expense </span>
          </Row>
          <Divider />
          <Row>
            <b> Category: </b> <span> Walmart </span>
          </Row>
          <Row>
            <b> Tags: </b> <span> Loan, Test, Borrow</span>
          </Row>
          <Divider />
          <Row>
            <b> Created: </b> <span> Sept 26 2024 </span>
          </Row>
          <Row>
            <b> Updated: </b> <span> Sept 26 2024 </span>
          </Row>
          <ButtonContainer>
            <BaseButton> Edit Transaction </BaseButton>
            <SecondaryButton> Delete Transaction </SecondaryButton>
          </ButtonContainer>
        </>
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
