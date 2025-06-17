import { useState } from "react";
import useUserStore from "../../store/user/userStore";
import {
  BaseButton,
  BaseCheckbox,
  BaseCheckboxContainer,
  Flex,
  PageContainer,
  PageTitle,
} from "../../styles";
import styled from "styled-components";
import { SPACING, FONTSIZE } from "../../Theme";
import { getUserPreferences } from "../../store/user/userSelectors";
import { UserPreferences } from "../../types/user";
import { useNavigate } from "react-router";
import {
  TransactionCategory,
  TransactionCategoryNameMap,
} from "types/Transaction";

import AccountDropdown from "components/AccountDropdown/AccountDropdown";

export default function Settings() {
  const navigate = useNavigate();

  const { logout, updateUser } = useUserStore();
  const userPreferences = getUserPreferences();
  const [newPreferences, setNewPreferences] = useState<UserPreferences>({
    currency: userPreferences?.currency || "CAD",
    disabledCategories: userPreferences?.disabledCategories || ["Investments"],
    defaultAccount: userPreferences?.defaultAccount || null,
  });

  const handleUpdateSettings = async () => {
    const success = await updateUser({
      preferences: newPreferences,
    });

    if (success) navigate("/");
  };

  const handleCategoryChange = (category: string) => {
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
          {Object.values(TransactionCategory).map((item) => (
            <BaseCheckboxContainer
              onClick={() => handleCategoryChange(item)}
              key={item}
            >
              <BaseCheckbox
                checked={!newPreferences?.disabledCategories.includes(item)}
                type="checkbox"
              />
              {TransactionCategoryNameMap[item]}
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
      <BaseButton onClick={handleUpdateSettings}>Save Changes</BaseButton>
      <BaseButton onClick={logout}>Sign Out</BaseButton>
    </PageContainer>
  );
}

export const SettingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.spacing2x};
  padding: ${SPACING.spacing5x} 0;
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
