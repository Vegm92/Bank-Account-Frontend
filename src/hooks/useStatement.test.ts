import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useStatement } from "./useStatement";
import * as api from "../services/api";
import { Transaction } from "../types/transaction";

vi.mock("../services/api");

describe("useStatement", () => {
  const mockGetStatement = vi.mocked(api.getStatement);

  const mockTransactions: Transaction[] = [
    { id: 1, date: "2023-07-01", amount: 100, balance: 1000, type: "deposit" },
    { id: 2, date: "2023-07-02", amount: 200, balance: 1200, type: "deposit" },
    { id: 3, date: "2023-07-03", amount: 50, balance: 1150, type: "withdraw" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetStatement.mockResolvedValue({
      success: true,
      message: "Statement retrieved successfully",
      data: mockTransactions,
    });
  });

  it("should fetch transactions successfully", async () => {
    const { result } = renderHook(() => useStatement());

    await waitFor(() => {
      expect(result.current.transactions).toEqual(mockTransactions);
    });

    expect(result.current.error).toBeNull();
  });

  it("should handle API error", async () => {
    mockGetStatement.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useStatement());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "An error occurred while fetching transactions"
      );
    });

    expect(result.current.transactions).toEqual([]);
  });

  it("should filter transactions", async () => {
    const { result } = renderHook(() => useStatement());

    await waitFor(() => {
      expect(result.current.transactions).toEqual(mockTransactions);
    });

    act(() => {
      result.current.handleFilterChange({
        target: { value: "deposit" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.filteredRows).toHaveLength(2);
    expect(result.current.filteredRows.every((t) => t.type === "deposit")).toBe(
      true
    );
  });

  it("should handle empty filter", async () => {
    const { result } = renderHook(() => useStatement());

    await waitFor(() => {
      expect(result.current.transactions).toEqual(mockTransactions);
    });

    act(() => {
      result.current.handleFilterChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.filteredRows).toEqual(mockTransactions);
  });
});
