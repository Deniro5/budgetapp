import { Flex, PageContainer, ScrollablePageContainer } from "styles";
import styled from "styled-components";
import { SPACING } from "theme";
import { useState } from "react";
import { Account } from "types/account";
import { AccountCard, AccountHeader } from "./components";
import useAccounts from "./hooks/useAccounts.ts";
import {
  AddAccountModal,
  EditAccountModal,
  DeleteAccountModal,
} from "./modals";
import { ViewAccountModal } from "./modals/ViewAccountModal/ViewAccountModal.tsx";
import { SkeletonLoader } from "components/SkeletonLoader/SkeletonLoader.tsx";
import { AccountOverlayType } from "./account.types.ts";

export default function Accounts() {
  const { activeAccounts, isLoading, error } = useAccounts();
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<AccountOverlayType | null>(
    null
  );

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
    setActiveAccount(null);
  };

  const getPageContent = () => {
    if (isLoading) return <SkeletonLoader rows={2} columns={3} height={320} />;
    if (error)
      return <div>Failed to load accounts. Please refresh the page</div>;
    if (!activeAccounts.length) return <div>No accounts found</div>;

    return activeAccounts.map((account) => (
      <AccountCard
        key={account._id}
        account={account}
        setActiveOverlay={setActiveOverlay}
        setActiveAccount={setActiveAccount}
      />
    ));
  };

  return (
    <PageContainer>
      <AccountHeader setActiveOverlay={setActiveOverlay} />
      <PageColumnFlexContainer>
        <ScrollablePageContainer>
          <ContentContainer>{getPageContent()}</ContentContainer>
        </ScrollablePageContainer>
      </PageColumnFlexContainer>
      {activeOverlay === AccountOverlayType.ADD && (
        <AddAccountModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === AccountOverlayType.VIEW && activeAccount && (
        <ViewAccountModal
          onClose={handleCloseOverlay}
          account={activeAccount}
        />
      )}
      {activeOverlay === AccountOverlayType.EDIT && activeAccount && (
        <EditAccountModal
          onClose={handleCloseOverlay}
          account={activeAccount}
        />
      )}
      {activeOverlay === AccountOverlayType.DELETE && activeAccount && (
        <DeleteAccountModal
          onClose={handleCloseOverlay}
          account={activeAccount}
        />
      )}
    </PageContainer>
  );
}

const PageColumnFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.spacing6x};
  margin-top: ${SPACING.spacing9x};
`;

const ContentContainer = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
`;
