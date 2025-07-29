import React from "react";

interface RenderChartProps {
  isEmpty: boolean;
  loading: boolean;
  error: string | Error | null;
  chartElement: React.ReactNode;
  loadingElement: React.ReactNode;
}
export default function renderChart({
  isEmpty,
  loading,
  error,
  chartElement,
  loadingElement,
}: RenderChartProps) {
  if (loading) {
    return loadingElement;
  } else if (error) {
    return <div> Failed to fetch data. Please refresh and try again.</div>;
  } else if (isEmpty) {
    return <div>No data available to show</div>;
  }
  return chartElement;
}
