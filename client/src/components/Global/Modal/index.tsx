import React, { useRef } from "react";
import styled from "styled-components";
import { SPACING } from "../../../Theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { IconButton, SecondaryButton } from "../../../Styles";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  return (
    <>
      <StyledOverlay isOpen={isOpen} onClick={handleClickOutside} />
      <StyledDialog isOpen={isOpen} ref={dialogRef}>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faClose} height={16} width={16} />
        </CloseButton>
        {children}
      </StyledDialog>
    </>
  );
}

const StyledOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 999;
`;

const StyledDialog = styled.dialog<{ isOpen: boolean }>`
  position: absolute;
  top: 40%;
  transform: translateY(-40%);
  background: white;
  border: none;
  padding: ${SPACING.spacing8x};
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  color: black;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 0px;
`;

export default Modal;
