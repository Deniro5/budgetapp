import styled from "styled-components";
import { COLORS, SPACING } from "../../Theme";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faGear,
  faFileInvoiceDollar,
  IconDefinition,
  faChevronRight,
  faChevronLeft,
  faSackDollar,
  faHandHoldingDollar,
  faChartLine,
  faWallet,
  faCreditCard,
  faCreditCardAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { getFirstPath } from "../../utils";
import { useEffect } from "react";

type SidebarItem = {
  href: string;
  icon: IconDefinition;
  label: string;
  isActive: boolean;
};

type SidebarProps = {
  isExpanded: boolean;
  toggleExpanded: () => void;
};

const Sidebar = ({ isExpanded, toggleExpanded }: SidebarProps) => {
  const firstPath = getFirstPath();
  const sidebarItems: SidebarItem[] = [
    {
      href: "/",
      icon: faBorderAll,
      label: "Dashboard",
      isActive: firstPath === "",
    },
    {
      href: "/transactions",
      icon: faChartLine,
      label: "Transactions",
      isActive: firstPath === "transactions",
    },
    {
      href: "/accounts",
      icon: faFileInvoiceDollar,
      label: "Accounts",
      isActive: firstPath === "accounts",
    },
    {
      href: "/budget",
      icon: faFileInvoiceDollar,
      label: "Budget",
      isActive: firstPath === "budget",
    },
    {
      href: "/savings",
      icon: faSackDollar,
      label: "Savings",
      isActive: firstPath === "savings",
    },
    {
      href: "/investments",
      icon: faHandHoldingDollar,
      label: "Investments",
      isActive: firstPath === "investments",
    },
    {
      href: "/settings",
      icon: faGear,
      label: "Settings",
      isActive: firstPath === "settings",
    },
  ];
  const navigate = useNavigate();

  return (
    <SidebarContainer data-testid={"sidebar"} isExpanded={isExpanded}>
      {sidebarItems.map((sidebarItem) => (
        <MenuItem
          isActive={sidebarItem.isActive}
          onClick={() => navigate(sidebarItem.href)}
        >
          <IconContainer>
            <FontAwesomeIcon color={COLORS.lightFont} icon={sidebarItem.icon} />
          </IconContainer>
          {isExpanded && <IconLabel> {sidebarItem.label} </IconLabel>}
        </MenuItem>
      ))}
      <ExpandMenuItem data-testid={"sidebar-button"} onClick={toggleExpanded}>
        <IconContainer>
          <FontAwesomeIcon
            color={COLORS.lightFont}
            icon={isExpanded ? faChevronLeft : faChevronRight}
          />
        </IconContainer>
        {isExpanded && <IconLabel> Collapse </IconLabel>}
      </ExpandMenuItem>
    </SidebarContainer>
  );
};

const MenuItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? COLORS.pureWhite : COLORS.lightGrey)};
  padding: ${SPACING.spacing2x};
  border-radius: 4px;
  margin: 0;
  height: 32px;

  path {
    color: ${COLORS.lightGrey};
  }
  &:hover {
    color: ${COLORS.pureWhite};
    path {
      color: ${COLORS.pureWhite};
    }
  }
  ${({ isActive }) =>
    isActive &&
    `
    background: ${COLORS.primary};
    path {
        color: ${COLORS.pureWhite};
    }
    text-decoration:underline;
    font-weight: 600;
    text-underline-offset: 2px;
  `}
`;

const IconContainer = styled.div``;

const SidebarContainer = styled.div<{ isExpanded: boolean }>`
  display: flex;
  align-items: ${({ isExpanded }) => (isExpanded ? "flex-start" : "center")};
  flex-direction: column;
  position: fixed;
  gap: ${SPACING.spacing4x};
  height: calc(100vh);
  width: ${({ isExpanded }) => (isExpanded ? "200px" : "40px")};
  background: ${COLORS.primary};
  padding: ${({ isExpanded }) =>
    isExpanded
      ? `${SPACING.spacing6x} ${SPACING.spacing3x}`
      : `${SPACING.spacing6x} 0`};

  ${MenuItem} {
    width: ${({ isExpanded }) => isExpanded && "150px"};
  }

  ${IconContainer} {
    width: ${({ isExpanded }) => isExpanded && "16px"};
  }
`;

const ExpandMenuItem = styled(MenuItem)`
  margin-top: auto;
`;

const IconLabel = styled.span`
  padding-left: ${SPACING.spacing3x};
`;

export default Sidebar;
