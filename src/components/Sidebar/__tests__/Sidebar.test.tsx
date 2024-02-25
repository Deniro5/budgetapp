import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "..";
import { BrowserRouter } from "react-router-dom";

const Providers = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return <BrowserRouter>{children}</BrowserRouter>;
};

test("Sidebar collapses/expands on click", () => {
  render(<Sidebar />, { wrapper: Providers });
  expect(screen.getByTestId("sidebar")).toHaveStyle({ width: "40px" });

  const sidebarBtn = screen.getByTestId("sidebar-button");
  fireEvent.click(sidebarBtn);

  expect(screen.getByTestId("sidebar")).toHaveStyle({ width: "160px" });

  fireEvent.click(sidebarBtn);

  expect(screen.getByTestId("sidebar")).toHaveStyle({ width: "40px" });
});
