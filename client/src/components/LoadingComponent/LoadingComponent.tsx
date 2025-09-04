import styled, { keyframes } from "styled-components";
import { FONTSIZE, SPACING } from "theme";

type LoadingComponentProps = {
  message?: string; // customizable loading text
};

export default function LoadingComponent({
  message = "Loading...",
}: LoadingComponentProps) {
  return (
    <Container>
      <Spinner />
      <Text>{message}</Text>
    </Container>
  );
}

// Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1); /* light gray */
  border-top: 4px solid #3498db; /* blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${SPACING.spacing6x};
  margin-top: 30vh;
`;

const Text = styled.div`
  font-size: ${FONTSIZE.lg};
  color: #333;
`;
