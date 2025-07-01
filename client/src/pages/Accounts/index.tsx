import { Flex, PageContainer } from "../../styles.ts";
import styled from "styled-components";
import { SPACING } from "theme";
import { useState } from "react";

import AccountsHeader from "./components/AccountsHeader/index.tsx";
import { Account } from "types/account.ts";
import AccountAddModal from "./components/Modals/AccountAddModal/index.tsx";

import useAccountStore from "store/account/accountStore.ts";
import AccountCard from "./components/AccountCard/index.tsx";
import AccountEditModal from "./components/Modals/AccountEditModal/index.tsx";
import AccountDeleteModal from "./components/Modals/AccountDeleteModal/index.tsx";

export enum AccountOverlayType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
}

function Accounts() {
  const { accounts } = useAccountStore();
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<AccountOverlayType | null>(
    null
  );

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
    setActiveAccount(null);
  };

  return (
    <PageContainer>
      <AccountsHeader setActiveOverlay={setActiveOverlay} />
      <PageColumnFlexContainer>
        <ContentContainer>
          {!accounts.length && (
            <>
              {" "}
              You currently have no accounts. Click the "Add Account" button in
              the top right corner to make your first account.{" "}
            </>
          )}
          {accounts &&
            accounts.map((account) => (
              <AccountCard
                setActiveOverlay={setActiveOverlay}
                setActiveAccount={setActiveAccount}
                account={account}
                key={account._id}
              />
            ))}
        </ContentContainer>
      </PageColumnFlexContainer>
      {activeOverlay === AccountOverlayType.ADD && (
        <AccountAddModal onClose={handleCloseOverlay} />
      )}
      {activeOverlay === AccountOverlayType.EDIT && activeAccount && (
        <AccountEditModal
          onClose={handleCloseOverlay}
          account={activeAccount}
        />
      )}
      {activeOverlay === AccountOverlayType.DELETE && activeAccount && (
        <AccountDeleteModal
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

export default Accounts;
