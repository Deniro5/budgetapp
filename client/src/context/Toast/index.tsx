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
import { COLORS, SPACING } from "theme";

type ToastType = "success" | "error";

type Toast = {
  toast: string;
  type: ToastType;
};

interface ToastContextType {
  toast: Toast | null;
  setToast: Dispatch<React.SetStateAction<Toast | null>>;
}

// Initial context
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
  border-radius: 4px;
  position: absolute;
  right: 8px;
  top: 16px;
  background: ${({ $color }) => $color};
  width: 400px;
  padding: ${SPACING.spacing4x};
  color: ${COLORS.pureWhite};
  transform: translateY(${({ $show }) => ($show ? "8px" : "-80px")});
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
  text-align: center;
  z-index: 1000;
`;
