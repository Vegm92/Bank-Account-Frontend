import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TransferForm from "./TransferForm";
import { useTransfer } from "../hooks/useTransfer";

vi.mock("../hooks/useTransfer");

describe("TransferForm", () => {
  const mockHandleSubmit = vi.fn();
  const mockSetRecipientIBAN = vi.fn();
  const mockSetAmount = vi.fn();
  const mockHandleIBANClick = vi.fn();

  beforeEach(() => {
    vi.mocked(useTransfer).mockReturnValue({
      accountInfo: { iban: "TEST123", balance: 1000 },
      recipientIBAN: "",
      amount: "",
      error: null,
      success: null,
      loading: false,
      otherIBANs: ["IBAN1", "IBAN2", "IBAN3"],
      handleSubmit: mockHandleSubmit,
      setRecipientIBAN: mockSetRecipientIBAN,
      setAmount: mockSetAmount,
      handleIBANClick: mockHandleIBANClick,
    });
  });

  it("renders correctly", () => {
    render(<TransferForm />);
    expect(screen.getByText("Transfer Funds")).toBeInTheDocument();
    expect(screen.getByText("Current Balance: 1000.00 €")).toBeInTheDocument();
    expect(screen.getByLabelText("Recipient IBAN *")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount *")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Transfer" })
    ).toBeInTheDocument();
  });

  it("handles recipient IBAN input", () => {
    render(<TransferForm />);
    const input = screen.getByLabelText("Recipient IBAN *");
    fireEvent.change(input, { target: { value: "IBAN123" } });
    expect(mockSetRecipientIBAN).toHaveBeenCalledWith("IBAN123");
  });

  it("handles amount input", () => {
    render(<TransferForm />);
    const input = screen.getByLabelText("Amount *");
    fireEvent.change(input, { target: { value: "100" } });
    expect(mockSetAmount).toHaveBeenCalledWith("100");
  });

  it("handles form submission", async () => {
    const { rerender } = render(<TransferForm />);

    // Fill in the form fields
    const recipientIBANInput = screen.getByLabelText("Recipient IBAN *");
    const amountInput = screen.getByLabelText("Amount *");

    fireEvent.change(recipientIBANInput, { target: { value: "IBAN123" } });
    fireEvent.change(amountInput, { target: { value: "100" } });

    // Update the mock to reflect the changes
    vi.mocked(useTransfer).mockReturnValue({
      ...vi.mocked(useTransfer)(),
      recipientIBAN: "IBAN123",
      amount: "100",
    });

    // Re-render the component with updated values
    rerender(<TransferForm />);

    const submitButton = screen.getByRole("button", { name: "Transfer" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  it("displays error message", () => {
    vi.mocked(useTransfer).mockReturnValue({
      ...vi.mocked(useTransfer)(),
      error: "Error message",
    });
    render(<TransferForm />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("displays success message", () => {
    vi.mocked(useTransfer).mockReturnValue({
      ...vi.mocked(useTransfer)(),
      success: "Success message",
    });
    render(<TransferForm />);
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  it("handles IBAN click", () => {
    render(<TransferForm />);
    const ibanChip = screen.getByText("IBAN1");
    fireEvent.click(ibanChip);
    expect(mockHandleIBANClick).toHaveBeenCalledWith("IBAN1");
  });
});
