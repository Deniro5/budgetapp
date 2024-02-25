import { Route, Routes } from "react-router";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { COLORS, SPACING } from "../Theme";

function MainLayout() {
  return (
    <AppContainer>
      <Sidebar />

      <ContentContainer>
        <Routes>
          <Route path="/" element={<> dashboard </>} />
          <Route path="/transactions" element={<p> transactions </p>} />
          <Route path="/reports" element={<p> reports </p>} />
          <Route path="/savings" element={<p> savings </p>} />
          <Route path="/debts" element={<p> debts </p>} />
          <Route path="/settings" element={<p> settings </p>} />
        </Routes>
      </ContentContainer>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: ${SPACING.spacing6x};
`;

export default MainLayout;
