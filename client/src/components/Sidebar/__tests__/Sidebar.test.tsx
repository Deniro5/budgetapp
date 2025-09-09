import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "..";
import { MemoryRouter } from "react-router-dom";
import { COLORS } from "theme";

const Providers = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return <MemoryRouter>{children}</MemoryRouter>;
};

test("Sidebar collapses/expands on click", () => {
  render(<Sidebar isExpanded={false} toggleExpanded={() => {}} />, {
    wrapper: Providers,
  });
  expect(screen.getByTestId("sidebar")).toHaveStyle({ width: "40px" });

  const sidebarBtn = screen.getByTestId("sidebar-button");
  fireEvent.click(sidebarBtn);

  expect(screen.getByTestId("sidebar")).toHaveStyle({ width: "160px" });
  fireEvent.click(sidebarBtn);

  expect(screen.getByTestId("sidebar")).toHaveStyle({ width: "40px" });
});

test("Sidebar has no labels when collapsed/ has labels when expanded", () => {
  render(<Sidebar isExpanded={false} toggleExpanded={() => {}} />, {
    wrapper: Providers,
  });
  expect(screen.getByTestId("sidebar")).toHaveStyle({ width: "40px" });

  //no labels when collapsed
  expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  expect(screen.queryByText("Transactions")).not.toBeInTheDocument();
  expect(screen.queryByText("Reports")).not.toBeInTheDocument();
  expect(screen.queryByText("Savings")).not.toBeInTheDocument();
  expect(screen.queryByText("Debts")).not.toBeInTheDocument();
  expect(screen.queryByText("Settings")).not.toBeInTheDocument();

  const sidebarBtn = screen.getByTestId("sidebar-button");
  fireEvent.click(sidebarBtn);

  //labels when expanded
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
  expect(screen.getByText("Transactions")).toBeInTheDocument();
  expect(screen.getByText("Reports")).toBeInTheDocument();
  expect(screen.getByText("Savings")).toBeInTheDocument();
  expect(screen.getByText("Debts")).toBeInTheDocument();
  expect(screen.getByText("Settings")).toBeInTheDocument();
});

describe("Sidebar shows correct active styles", () => {
  it('should show "Dashboard" as active when URL path is "/"', () => {
    render(<Sidebar isExpanded={false} toggleExpanded={() => {}} />, {
      wrapper: Providers,
    }); //

    expect(screen.getByTestId("sidebar-Dashboard")).toHaveStyle({
      background: COLORS.primary,
    });
  });

  //we need is Active tests for other sections but they arent working
});
