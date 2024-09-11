import styled from "styled-components";
import { Card } from "../../Styles";

const Dashboard = () => (
  <DashboardContainer>
    <Column>
      <DashboardCard>Hello </DashboardCard>
    </Column>
    <Column>
      <DashboardCard> a</DashboardCard>
    </Column>
    <Column>
      <DashboardCard> a </DashboardCard>
    </Column>
    <Column>
      <DashboardCard> a </DashboardCard>
    </Column>
    <Column>
      <DashboardCard> a </DashboardCard>
    </Column>
    <Column>
      <DashboardCard> a </DashboardCard>
    </Column>
  </DashboardContainer>
);

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 100%;
  gap: 24px;
`;

const DashboardCard = styled(Card)`
  height: calc(100% - 48px);
  width: 200px;
`;

const Column = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export default Dashboard;
