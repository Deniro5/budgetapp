import { Route, Routes } from "react-router";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { COLORS, SPACING } from "../Theme";
import Dashboard from "../components/Dashboard";
import { useState } from "react";
import Transactions from "../pages/Transactions";
import Settings from "../pages/Settings";

function MainLayout() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  return (
    <AppContainer>
      <Sidebar isExpanded={isExpanded} toggleExpanded={toggleExpanded} />

      <ContentContainer isExpanded={isExpanded}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<p> reports </p>} />
          <Route path="/savings" element={<p> savings </p>} />
          <Route path="/debts" element={<p> debts </p>} />
          <Route path="/settings" element={<Settings />} />
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
  width: ${({ isExpanded }) =>
    isExpanded ? "calc(100vw - 200px)" : "calc(100vw - 40px)"};
  height: 100vh;
  background: white;
  overflow: hidden;
`;

export default MainLayout;
