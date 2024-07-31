import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTransaction } from "./useTransaction";
import * as api from "../services/api";

vi.mock("../services/api");

describe("useTransaction", () => {
  const mockGetAccountInfo = vi.mocked(api.getAccountInfo);
  const mockDeposit = vi.mocked(api.deposit);
  const mockWithdraw = vi.mocked(api.withdraw);

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAccountInfo.mockResolvedValue({ iban: "test-iban", balance: 1000 });
  });

  it("should handle deposit successfully", async () => {
    mockDeposit.mockResolvedValue({
      success: true,
      message: "Deposit successful",
      data: { balance: 1100 },
    });

    const { result } = renderHook(() => useTransaction("Deposit"));

    act(() => {
      result.current.setAmount("100");
    });

    await act(async () => {
      await result.current.handleTransaction();
    });

    expect(mockDeposit).toHaveBeenCalledWith(100);
    expect(result.current.success).toBe("Successfully Deposited 100€");
    expect(result.current.balance).toBe(1100);
    expect(result.current.error).toBe("");
  });

  it("should handle withdrawal successfully", async () => {
    mockWithdraw.mockResolvedValue({
      success: true,
      message: "Withdrawal successful",
      data: { balance: 900 },
    });

    const { result } = renderHook(() => useTransaction("Withdraw"));

    act(() => {
      result.current.setAmount("100");
    });

    await act(async () => {
      await result.current.handleTransaction();
    });

    expect(mockWithdraw).toHaveBeenCalledWith(100);
    expect(result.current.success).toBe("Successfully Withdrew 100€");
    expect(result.current.balance).toBe(900);
    expect(result.current.error).toBe("");
  });

  it("should handle insufficient funds for withdrawal", async () => {
    mockGetAccountInfo.mockResolvedValue({ iban: "test-iban", balance: 50 });

    const { result } = renderHook(() => useTransaction("Withdraw"));

    act(() => {
      result.current.setAmount("100");
    });

    await act(async () => {
      await result.current.handleTransaction();
    });

    expect(mockWithdraw).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Insufficient funds");
    expect(result.current.success).toBe("");
  });

  it("should handle invalid amount", async () => {
    const { result } = renderHook(() => useTransaction("Deposit"));

    act(() => {
      result.current.setAmount("-100");
    });

    await act(async () => {
      await result.current.handleTransaction();
    });

    expect(mockDeposit).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Please enter a valid positive number");
    expect(result.current.success).toBe("");
  });

  it("should handle API error during transaction", async () => {
    mockDeposit.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useTransaction("Deposit"));

    act(() => {
      result.current.setAmount("100");
    });

    await act(async () => {
      await result.current.handleTransaction();
    });

    expect(mockDeposit).toHaveBeenCalledWith(100);
    expect(result.current.error).toBe(
      "An error occurred while processing your Deposit."
    );
    expect(result.current.success).toBe("");
  });

  it("should refresh balance successfully", async () => {
    const { result } = renderHook(() => useTransaction("Deposit"));

    await act(async () => {
      await result.current.refreshBalance();
    });

    expect(mockGetAccountInfo).toHaveBeenCalled();
    expect(result.current.balance).toBe(1000);
    expect(result.current.error).toBe("");
  });

  it("should handle error during balance refresh", async () => {
    mockGetAccountInfo.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useTransaction("Deposit"));

    await act(async () => {
      await result.current.refreshBalance();
    });

    expect(mockGetAccountInfo).toHaveBeenCalled();
    expect(result.current.error).toBe("Failed to update balance");
  });

  it("should handle unsuccessful API response", async () => {
    mockDeposit.mockResolvedValue({
      success: false,
      message: "Transaction failed",
      data: { balance: 1000 },
    });

    const { result } = renderHook(() => useTransaction("Deposit"));

    act(() => {
      result.current.setAmount("100");
    });

    await act(async () => {
      await result.current.handleTransaction();
    });

    expect(mockDeposit).toHaveBeenCalledWith(100);
    expect(result.current.error).toBe("Transaction failed");
    expect(result.current.success).toBe("");
  });

  it("should handle undefined balance in API response", async () => {
    mockDeposit.mockResolvedValue({
      success: true,
      message: "Deposit successful",
      data: {}, // No balance provided
    });
    mockGetAccountInfo.mockResolvedValue({ iban: "test-iban", balance: 1100 });

    const { result } = renderHook(() => useTransaction("Deposit"));

    act(() => {
      result.current.setAmount("100");
    });

    await act(async () => {
      await result.current.handleTransaction();
    });

    expect(mockDeposit).toHaveBeenCalledWith(100);
    expect(mockGetAccountInfo).toHaveBeenCalled(); // Should call refreshBalance
    expect(result.current.balance).toBe(1100);
    expect(result.current.success).toBe("Successfully Deposited 100€");
    expect(result.current.error).toBe("");
  });
});
