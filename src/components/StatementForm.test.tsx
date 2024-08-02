import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StatementForm from "./StatementForm";
import { useStatement } from "../hooks/useStatement";

vi.mock("../hooks/useStatement");

describe("StatementForm", () => {
  const mockTransactions = [
    { id: 1, date: "2023-07-01", amount: 100, balance: 1000, type: "deposit" },
    { id: 2, date: "2023-07-02", amount: 50, balance: 950, type: "withdraw" },
  ];

  const mockHandleFilterChange = vi.fn();

  beforeEach(() => {
    vi.mocked(useStatement).mockReturnValue({
      transactions: mockTransactions,
      error: null,
      filter: "",
      filteredRows: mockTransactions,
      handleFilterChange: mockHandleFilterChange,
    });
  });

  it("renders correctly", () => {
    render(<StatementForm />);
    expect(screen.getByText("Account Statement")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter transactions")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Balance")).toBeInTheDocument();
  });

  it("displays transactions", () => {
    render(<StatementForm />);
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("deposit")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$1000.00")).toBeInTheDocument();
  });

  it("handles filter input", async () => {
    render(<StatementForm />);
    const input = screen.getByLabelText("Filter transactions");
    fireEvent.change(input, { target: { value: "deposit" } });

    await waitFor(() => {
      expect(mockHandleFilterChange).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  it("displays error message", () => {
    vi.mocked(useStatement).mockReturnValue({
      transactions: [],
      error: "Error fetching transactions",
      filter: "",
      filteredRows: [],
      handleFilterChange: mockHandleFilterChange,
    });
    render(<StatementForm />);
    expect(screen.getByText("Error fetching transactions")).toBeInTheDocument();
  });

  it("applies filter and displays filtered transactions", async () => {
    const { rerender } = render(<StatementForm />);

    const input = screen.getByLabelText("Filter transactions");
    fireEvent.change(input, { target: { value: "deposit" } });

    // Update the mock to reflect the filtered state
    vi.mocked(useStatement).mockReturnValue({
      ...vi.mocked(useStatement)(),
      filter: "deposit",
      filteredRows: [mockTransactions[0]],
    });

    // Re-render the component with updated values
    rerender(<StatementForm />);

    await waitFor(() => {
      expect(screen.getByText("deposit")).toBeInTheDocument();
      expect(screen.queryByText("withdraw")).not.toBeInTheDocument();
    });
  });
});
