import React from "react";
import styled from "styled-components";
import { SPACING } from "theme";

type DropdownListItemProps = {
  children: React.ReactNode;
};

export default function DropdownListItem({ children }: DropdownListItemProps) {
  return <ListItemContainer>{children}</ListItemContainer>;
}

const ListItemContainer = styled.div`
  padding: ${SPACING.spacing2x};
`;
