import React from "react";
import Modal from "./Modal";
import styled from "styled-components";
import { SPACING, FONTSIZE } from "../../Theme";
import { BaseButton, SecondaryButton } from "../../styles";

type ConfirmModalProps = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  text: string;
  handleConfirm: () => void;
  handleCancel: () => void;
};

export default function ConfirmModal({
  title = "Confirm",
  confirmText = "Yes",
  cancelText = "Cancel",
  text,
  handleConfirm,
  handleCancel,
}: ConfirmModalProps) {
  return (
    <>
      <Title> {title} </Title>
      <p> {text} </p>
      <ButtonContainer>
        <BaseButton onClick={handleConfirm}>{confirmText}</BaseButton>
        <SecondaryButton onClick={handleCancel}>{cancelText}</SecondaryButton>
      </ButtonContainer>
    </>
  );
}

const Title = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: ${SPACING.spacing6x};
  font-size: ${FONTSIZE.lg};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
  gap: ${SPACING.spacing6x};
`;
