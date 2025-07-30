import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QuickstartProvider } from "./Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QuickstartProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </QuickstartProvider>
  </React.StrictMode>
);
