import { useState } from "react";

function useModalController() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  return { isOpen, closeModal, openModal };
}

export default useModalController;
