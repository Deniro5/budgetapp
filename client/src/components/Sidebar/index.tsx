import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faGear,
  IconDefinition,
  faChevronRight,
  faChevronLeft,
  faExchange,
  faChartLine,
  faChartPie,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { getFirstPath } from "utils";

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
      icon: faExchange,
      label: "Transactions",
      isActive: firstPath === "transactions",
    },
    {
      href: "/budget",
      icon: faChartPie,
      label: "Budget",
      isActive: firstPath === "budget",
    },

    {
      href: "/investments",
      icon: faChartLine,
      label: "Investments",
      isActive: firstPath === "investments",
    },
    {
      href: "/accounts",
      icon: faWallet,
      label: "Accounts",
      isActive: firstPath === "accounts",
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
    <SidebarContainer data-testid={"sidebar"} $isExpanded={isExpanded}>
      {sidebarItems.map((sidebarItem) => (
        <MenuItem
          $isActive={sidebarItem.isActive}
          onClick={() => navigate(sidebarItem.href)}
          key={sidebarItem.href}
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

const MenuItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ $isActive }) =>
    $isActive ? COLORS.pureWhite : COLORS.darkPrimary};
  padding: ${SPACING.spacing3x};
  border-radius: 4px;
  margin: 0;
  height: 32px;
  font-weight: 500;
  font-size: ${FONTSIZE.md};

  path {
    color: ${COLORS.primary};
  }
  &:hover {
    color: ${COLORS.darkPrimary};
    path {
      color: ${COLORS.darkPrimary};
    }
  }
  ${({ $isActive }) =>
    $isActive &&
    `
    background: ${COLORS.darkPrimary};
    path {
        color: ${COLORS.pureWhite};
    }

    font-weight: 600;


      &:hover {
    color: ${COLORS.pureWhite};
    path {
      color: ${COLORS.pureWhite};
    }
  }
  `}
`;

const IconContainer = styled.div``;

const SidebarContainer = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: ${({ $isExpanded }) => ($isExpanded ? "flex-start" : "center")};
  border-right: 1px solid ${COLORS.lightFont};
  flex-direction: column;
  position: fixed;
  gap: ${SPACING.spacing4x};
  height: calc(100vh);
  width: ${({ $isExpanded }) => ($isExpanded ? "200px" : "40px")};
  background: ${COLORS.lightPrimary};
  padding: ${({ $isExpanded }) =>
    $isExpanded
      ? `${SPACING.spacing6x} ${SPACING.spacing3x}`
      : `${SPACING.spacing6x} 0`};

  ${MenuItem} {
    width: ${({ $isExpanded }) => $isExpanded && "150px"};
  }

  ${IconContainer} {
    width: ${({ $isExpanded }) => $isExpanded && "16px"};
  }
`;

const ExpandMenuItem = styled(MenuItem)`
  margin-top: auto;
`;

const IconLabel = styled.span`
  padding-left: ${SPACING.spacing3x};
`;

export default Sidebar;
