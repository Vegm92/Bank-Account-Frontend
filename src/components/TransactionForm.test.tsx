import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionForm from "./TransactionForm";
import { useTransaction } from "../hooks/useTransaction";

// Mock the useTransaction hook
vi.mock("../hooks/useTransaction");

describe("TransactionForm", () => {
  const mockHandleTransaction = vi.fn();
  const mockSetAmount = vi.fn();
  const mockRefreshBalance = vi.fn();

  beforeEach(() => {
    vi.mocked(useTransaction).mockReturnValue({
      amount: "",
      setAmount: mockSetAmount,
      error: "",
      success: "",
      balance: 1000,
      handleTransaction: mockHandleTransaction,
      refreshBalance: mockRefreshBalance,
    });
  });

  it("renders correctly for Deposit", () => {
    render(<TransactionForm type="Deposit" />);
    expect(screen.getByText("Deposit Funds")).toBeInTheDocument();
    expect(screen.getByText("Current Balance: 1000.00 €")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deposit" })).toBeInTheDocument();
  });

  it("renders correctly for Withdraw", () => {
    render(<TransactionForm type="Withdraw" />);
    expect(screen.getByText("Withdraw Funds")).toBeInTheDocument();
    expect(screen.getByText("Current Balance: 1000.00 €")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Withdraw" })
    ).toBeInTheDocument();
  });

  it("handles amount input", () => {
    render(<TransactionForm type="Deposit" />);
    const input = screen.getByRole("spinbutton", { name: "Amount" });
    fireEvent.change(input, { target: { value: "100" } });
    expect(mockSetAmount).toHaveBeenCalledWith("100");
  });

  it("handles form submission", async () => {
    const mockHandleTransaction = vi.fn();
    vi.mocked(useTransaction).mockReturnValue({
      amount: "100",
      setAmount: vi.fn(),
      error: "",
      success: "",
      balance: 1000,
      handleTransaction: mockHandleTransaction,
      refreshBalance: vi.fn(),
    });

    render(<TransactionForm type="Deposit" />);

    const form = screen.getByLabelText("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockHandleTransaction).toHaveBeenCalled();
    });
  });

  it("displays error message", () => {
    vi.mocked(useTransaction).mockReturnValue({
      amount: "",
      setAmount: mockSetAmount,
      error: "Error message",
      success: "",
      balance: 1000,
      handleTransaction: mockHandleTransaction,
      refreshBalance: mockRefreshBalance,
    });
    render(<TransactionForm type="Deposit" />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("displays success message", () => {
    vi.mocked(useTransaction).mockReturnValue({
      amount: "",
      setAmount: mockSetAmount,
      error: "",
      success: "Success message",
      balance: 1000,
      handleTransaction: mockHandleTransaction,
      refreshBalance: mockRefreshBalance,
    });
    render(<TransactionForm type="Deposit" />);
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });
});
