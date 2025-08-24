import { Route, Routes } from "react-router";
import Sidebar from "components/Sidebar";
import styled from "styled-components";
import { COLORS, SPACING } from "theme";
import { useEffect, useState } from "react";

import { ToastProvider } from "context/Toast";

import { lazy, Suspense } from "react";

const Accounts = lazy(() => import("pages/Accounts/AccountPage"));
const Budget = lazy(() => import("pages/Budget"));
const DashboardPage = lazy(() => import("pages/Dashboard/DashboardPage"));
const InvestmentsPage = lazy(() => import("pages/Investments/InvestmentsPage"));
const Settings = lazy(() => import("pages/Settings"));
const Transactions = lazy(() => import("pages/Transaction/TransactionsPage"));

function MainLayout() {
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
      <ToastProvider>
        <Sidebar isExpanded={isExpanded} toggleExpanded={toggleExpanded} />

        <ContentContainer $isExpanded={isExpanded}>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/reports" element={<p> reports </p>} />
              <Route path="/savings" element={<p> savings </p>} />
              <Route path="/debts" element={<p> debts </p>} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/investments" element={<InvestmentsPage />} />
            </Routes>
          </Suspense>
        </ContentContainer>
      </ToastProvider>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div<{ $isExpanded: boolean }>`
  flex: 1;
  padding: ${SPACING.spacing8x};
  margin-left: ${({ $isExpanded }) => ($isExpanded ? "200px" : "40px")};
  width: ${({ $isExpanded }) =>
    $isExpanded ? "calc(100vw - 200px)" : "calc(100vw - 40px)"};
  height: 100vh;
  background: ${COLORS.background};
`;

export default MainLayout;
