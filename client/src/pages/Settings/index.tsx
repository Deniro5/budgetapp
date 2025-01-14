import React, { ChangeEvent, useState } from "react";
import useUserStore from "../../zustand/user/userStore";
import {
  BaseButton,
  BaseCheckbox,
  BaseCheckboxContainer,
  BaseSelect,
  Flex,
  PageContainer,
  PageTitle,
} from "../../Styles";
import styled from "styled-components";
import { SPACING, FONTSIZE } from "../../Theme";
import { TRANSACTION_CATEGORIES } from "../../components/Transactions/constants";
import { getUserPreferences } from "../../zustand/user/userSelectors";
import { UserPreferences } from "../../types/user";
import { useNavigate } from "react-router";

export default function Settings() {
  const navigate = useNavigate();
  const { logout, updateUser } = useUserStore();
  const userPreferences = getUserPreferences();
  const [newPreferences, setNewPreferences] = useState<UserPreferences>({
    currency: userPreferences?.currency || "CAD",
    disabledCategories: userPreferences?.disabledCategories || ["Investments"],
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

  console.log(newPreferences?.disabledCategories);

  return (
    <PageContainer>
      <PageTitle> Settings </PageTitle>
      <SettingRow>
        <SettingName>Enabled Categories</SettingName>
        <CategoryContainer>
          {TRANSACTION_CATEGORIES.map((item) => (
            <BaseCheckboxContainer
              onClick={() => handleCategoryChange(item)}
              key={item}
            >
              <BaseCheckbox
                checked={!newPreferences?.disabledCategories.includes(item)}
                type="checkbox"
              />
              {item}
            </BaseCheckboxContainer>
          ))}
        </CategoryContainer>
      </SettingRow>
      <SettingRow>
        <SettingName>Currency</SettingName>
        <BaseSelect name="frequency" value={"dae"}>
          <option value="">Select frequency</option>
          <option value="one-time">One-Time</option>
          <option value="recurring">Recurring</option>
        </BaseSelect>
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
