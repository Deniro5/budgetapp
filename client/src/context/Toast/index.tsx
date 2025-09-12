import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";

type ToastType = "success" | "error";

type Toast = {
  toast: string;
  type: ToastType;
};

interface ToastContextType {
  toast: Toast | null;
  setToast: Dispatch<React.SetStateAction<Toast | null>>;
}

export const ToastContext = createContext<ToastContextType>({
  toast: null,
  setToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const toastColorMap: Record<ToastType, string> = {
  success: COLORS.darkGreen,
  error: COLORS.darkDeleteRed,
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const lastType = useRef<ToastType>("success"); //we need this so that the color doesnt flash when going off screen

  useEffect(() => {
    if (!toast?.toast) return;

    lastType.current = toast.type;
    const timeout = setTimeout(() => {
      setToast({
        type: lastType.current,
        toast: "",
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      <>
        <ToastContainer
          $show={!!toast?.toast}
          $color={toastColorMap[toast?.type || "success"]}
        >
          {toast?.toast}
        </ToastContainer>
        {children}
      </>
    </ToastContext.Provider>
  );
};

const ToastContainer = styled.div<{ $show: boolean; $color: string }>`
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 320px;
  background: ${({ $color }) => $color};
  color: ${COLORS.pureWhite};
  padding: ${SPACING.spacing4x} ${SPACING.spacing4x};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-size: ${FONTSIZE.md};
  font-weight: 500;
  text-align: center;
  z-index: 1000;
  pointer-events: auto;

  /* Smooth slide + fade animation */
  transform: translateY(${({ $show }) => ($show ? "0" : "-40px")});
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Optional hover effect */
  &:hover {
    filter: brightness(1.05);
  }
`;
