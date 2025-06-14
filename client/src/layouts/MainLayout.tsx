import { Route, Routes } from "react-router";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { COLORS, SPACING } from "../Theme";
import { useEffect, useState } from "react";
import Transactions from "../pages/Transaction/Transactions";
import Settings from "../pages/Settings";

import Accounts from "../pages/Accounts";
import Budget from "../pages/Budget";
import useInitialLoad from "../hooks/useInitialLoad";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";

const dashboardElement = <DashboardPage />;
const transactionsElement = <Transactions />;
const accountsElement = <Accounts />;
const budgetElement = <Budget />;
const settingsElement = <Settings />;

function MainLayout() {
  useInitialLoad();
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(!isExpanded);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppContainer>
      <Sidebar isExpanded={isExpanded} toggleExpanded={toggleExpanded} />

      <ContentContainer isExpanded={isExpanded}>
        <Routes>
          <Route path="/" element={dashboardElement} />
          <Route path="/transactions" element={transactionsElement} />
          <Route path="/accounts" element={accountsElement} />
          <Route path="/budget" element={budgetElement} />
          <Route path="/reports" element={<p> reports </p>} />
          <Route path="/savings" element={<p> savings </p>} />
          <Route path="/debts" element={<p> debts </p>} />
          <Route path="/settings" element={settingsElement} />
        </Routes>
      </ContentContainer>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div<{ isExpanded: boolean }>`
  flex: 1;
  padding: ${SPACING.spacing8x};
  margin-left: ${({ isExpanded }) => (isExpanded ? "200px" : "40px")};
  width: ${({ isExpanded }) =>
    isExpanded ? "calc(100vw - 200px)" : "calc(100vw - 40px)"};
  height: 100vh;
  background: ${COLORS.background};
`;

export default MainLayout;
