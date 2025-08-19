import Modal from "components/Global/Modal";
import ConfirmModal from "components/Global/ConfirmModal";
import { useDeleteInvestment } from "../hooks/useDeleteInvestment";

type DeleteInvestmentModalProps = {
  investmentId: string;
  onClose: () => void;
};

export function DeleteInvestmentModal({
  investmentId,
  onClose,
}: DeleteInvestmentModalProps) {
  const { mutate } = useDeleteInvestment();

  const handleConfirm = () => {
    mutate(investmentId);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text={
          "THIS CAN LEAD TO CORRUPT DATA IF YOU DELETE THIS WITHOUT KNOWING WHAT YOU ARE DOING. Are you sure you would like to proceed?"
        }
      />
    </Modal>
  );
}
