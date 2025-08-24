import React from "react";
import styled, { keyframes } from "styled-components";

type SkeletonLoaderProps = {
  rows: number;
  columns: number;
  width?: number | string;
  height?: number | string;
  gap?: number | string;
  borderRadius?: number | string;
  className?: string;
};

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const Container = styled.div<{ $gap: number | string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => (typeof $gap === "number" ? `${$gap}px` : $gap)};
  width: 100%;
`;

const Row = styled.div<{ $gap: number | string }>`
  display: flex;
  gap: ${({ $gap }) => (typeof $gap === "number" ? `${$gap}px` : $gap)};
  justify-content: flex-start;
`;

const SkeletonBlock = styled.div<{
  $width: number | string;
  $height: number | string;
  $borderRadius: number | string;
}>`
  background-color: #e0e0e0;
  border-radius: ${({ $borderRadius }) =>
    typeof $borderRadius === "number" ? `${$borderRadius}px` : $borderRadius};
  width: ${({ $width }) =>
    typeof $width === "number" ? `${$width}px` : $width};
  height: ${({ $height }) =>
    typeof $height === "number" ? `${$height}px` : $height};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  rows,
  columns,
  width = "100%",
  height = 20,
  gap = 8,
  borderRadius = 4,
  className,
}) => {
  const rowArray = Array.from({ length: rows });
  const columnArray = Array.from({ length: columns });

  return (
    <Container $gap={gap} className={className}>
      {rowArray.map((_, rowIndex) => (
        <Row key={rowIndex} $gap={gap}>
          {columnArray.map((_, colIndex) => (
            <SkeletonBlock
              key={colIndex}
              $width={width}
              $height={height}
              $borderRadius={borderRadius}
            />
          ))}
        </Row>
      ))}
    </Container>
  );
};
