import { Flex, PageContainer } from "../../styles.ts";
import styled from "styled-components";
import { SPACING } from "theme";
import { useState } from "react";

import { Account } from "types/account.ts";

import { AccountCard, AccountHeader } from "./components";
import useAccounts from "./hooks/useAccounts.ts";
import {
  AddAccountModal,
  EditAccountModal,
  DeleteAccountModal,
} from "./modals";
import { ViewAccountModal } from "./modals/ViewAccountModal/ViewAccountModal.tsx";

export enum AccountOverlayType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
  VIEW = "view",
}

function Accounts() {
  const { accounts } = useAccounts();
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
      <AccountHeader setActiveOverlay={setActiveOverlay} />
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

export default Accounts;
