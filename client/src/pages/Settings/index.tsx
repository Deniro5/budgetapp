import { useState } from "react";
import useUserStore from "store/user/userStore";
import {
  BaseButton,
  BaseCheckbox,
  BaseCheckboxContainer,
  Flex,
  PageContainer,
  PageTitle,
} from "styles";
import styled from "styled-components";
import { SPACING, FONTSIZE } from "theme";
import { getUserPreferences } from "store/user/userSelectors";
import { RawUserPreferences } from "types/user";
import { useNavigate } from "react-router";
import {
  transactionOnlyCategories,
  TransactionCategory,
} from "types/Transaction";

import AccountDropdown from "components/AccountDropdown/AccountDropdown";

export default function Settings() {
  const navigate = useNavigate();

  const { logout, updateUser } = useUserStore();
  const userPreferences = getUserPreferences();

  const [newPreferences, setNewPreferences] = useState<RawUserPreferences>({
    currency: userPreferences?.currency || "CAD",
    disabledCategories: userPreferences?.disabledCategories || [],
    defaultAccount: userPreferences?.defaultAccount?._id || null,
  });

  const handleUpdateSettings = async () => {
    const success = await updateUser({
      preferences: newPreferences,
    });

    if (success) navigate("/");
  };

  const handleCategoryChange = (category: TransactionCategory) => {
    const updatedDisabledCategories = [...newPreferences.disabledCategories];

    const categoryIndex = updatedDisabledCategories.findIndex(
      (disabledCategory) => category === disabledCategory
    );

    if (categoryIndex < 0) updatedDisabledCategories.push(category);
    else updatedDisabledCategories.splice(categoryIndex, 1);

    setNewPreferences({
      ...newPreferences,
      disabledCategories: updatedDisabledCategories,
    });
  };

  const handleDefaultAccountChange = (accountId: string) => {
    setNewPreferences({
      ...newPreferences,
      defaultAccount: accountId,
    });
  };

  return (
    <PageContainer>
      <PageTitle> Settings </PageTitle>
      <SettingRow>
        <SettingName>Enabled Categories</SettingName>
        <CategoryContainer>
          {Object.values(transactionOnlyCategories).map((item) => (
            <BaseCheckboxContainer
              onClick={() => handleCategoryChange(item)}
              key={item}
            >
              <BaseCheckbox
                checked={!newPreferences?.disabledCategories.includes(item)}
                onChange={() => {}}
                type="checkbox"
              />
              {item}
            </BaseCheckboxContainer>
          ))}
        </CategoryContainer>
      </SettingRow>
      <SettingRow>
        <SettingName>Default Account</SettingName>
        <AccountDropdown
          selectedAccountId={newPreferences.defaultAccount}
          handleAccountChange={handleDefaultAccountChange}
        />
      </SettingRow>
      <ButtonContainer>
        <BaseButton onClick={handleUpdateSettings}>Save Changes</BaseButton>
        <BaseButton onClick={logout}>Sign Out</BaseButton>
      </ButtonContainer>
    </PageContainer>
  );
}

export const SettingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.spacing2x};
  padding: ${SPACING.spacing5x} 0;
  max-width: 800px;
`;

export const SettingName = styled.h2`
  display: flex;
  flex-direction: column;
  font-size: ${FONTSIZE.lg};
  margin-bottom: ${SPACING.spacing2x};
`;

export const CategoryContainer = styled(Flex)`
  gap: ${SPACING.spacing4x};
  flex-wrap: wrap;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${SPACING.spacing2x};
  padding: ${SPACING.spacing5x} 0;
  max-width: 800px;
`;
