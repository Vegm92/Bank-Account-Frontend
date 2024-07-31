import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTransfer } from "./useTransfer";
import * as api from "../services/api";

vi.mock("../services/api");

describe("useTransfer", () => {
  const mockGetAccountInfo = vi.mocked(api.getAccountInfo);
  const mockTransfer = vi.mocked(api.transfer);
  const mockGetOtherIBANs = vi.mocked(api.getOtherIBANs);

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAccountInfo.mockResolvedValue({ iban: "test-iban", balance: 1000 });
    mockGetOtherIBANs.mockResolvedValue(["IBAN1", "IBAN2", "IBAN3"]);
  });

  it("should handle invalid IBAN", async () => {
    const { result } = renderHook(() => useTransfer());

    act(() => {
      result.current.setRecipientIBAN("invalid-iban");
      result.current.setAmount("100");
    });

    await act(async () => {
      await result.current.handleSubmit(
        new Event("submit") as unknown as React.FormEvent
      );
    });

    expect(mockTransfer).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Invalid IBAN number");
  });

  it("should handle IBAN click", () => {
    const { result } = renderHook(() => useTransfer());

    act(() => {
      result.current.handleIBANClick("IBAN2");
    });

    expect(result.current.recipientIBAN).toBe("IBAN2");
  });
});
