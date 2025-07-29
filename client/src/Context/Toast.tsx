import { createContext, Dispatch, ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import { COLORS, SPACING } from "theme";

interface ToastContext {
  toast: Toast | null;
  setToast: Dispatch<React.SetStateAction<Toast | null>>;
}

const initialState = {
  toast: null,
  setToast: () => {},
};

export const ToastContext = createContext<ToastContext>(
  initialState as ToastContext
);

type ToastType = "success" | "error";

type Toast = {
  toast: string;
  type: ToastType;
};

const { Provider } = ToastContext;

const toastColorMap = {
  success: COLORS.darkGreen,
  error: COLORS.darkDeleteRed,
};
export const ToastProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, [toast]);

  return (
    <Provider value={{ toast, setToast }}>
      <>
        <ToastContainer
          show={!!toast}
          color={toastColorMap[toast?.type || "success"]}
        >
          {toast?.toast}
        </ToastContainer>
        {props.children}
      </>
    </Provider>
  );
};

const ToastContainer = styled.div<{ show: boolean; color: string }>`
  border-radius: 4px;
  position: absolute;
  right: 8px;
  background: ${({ color }) => color};
  width: 400px;
  padding: ${SPACING.spacing4x};
  color: ${COLORS.pureWhite};
  transform: translateY(${({ show }) => (show ? "8px" : "-80px")});
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
  text-align: center;
  z-index: 1000;
`;
