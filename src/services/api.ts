import axios from "axios";
import { getOrCreateIBAN } from "../utils/ibanUtils";
import { ApiResponse } from "../types/api";
import { TransactionResponse } from "../types/transaction";

const API_URL = import.meta.env.VITE_API_URL;

console.log("VITE_API_URL: ", API_URL);

export interface AccountInfo {
  iban: string;
  balance: number;
}

export const api = axios.create({
  baseURL: API_URL,
});

export const deposit = async (
  amount: number
): Promise<ApiResponse<TransactionResponse>> => {
  const iban = getOrCreateIBAN();
  try {
    const response = await api.post<ApiResponse<TransactionResponse>>(
      "api/accounts/deposit",
      { amount, iban }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while processing the deposit",
    };
  }
};

export const withdraw = async (
  amount: number
): Promise<ApiResponse<TransactionResponse>> => {
  const iban = getOrCreateIBAN();
  try {
    const response = await api.post<ApiResponse<TransactionResponse>>(
      "api/accounts/withdraw",
      { amount, iban }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while processing the withdrawal",
    };
  }
};

export const transfer = async (
  amount: number,
  recipientIBAN: string
): Promise<ApiResponse<TransactionResponse>> => {
  const senderIBAN = getOrCreateIBAN();
  try {
    const response = await api.post<ApiResponse<TransactionResponse>>(
      "api/accounts/transfer",
      { amount, senderIBAN, recipientIBAN }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while processing the transfer",
    };
  }
};

export const getStatement = async (): Promise<
  ApiResponse<TransactionResponse[]>
> => {
  const iban = getOrCreateIBAN();
  try {
    const response = await api.get<ApiResponse<TransactionResponse[]>>(
      "api/accounts/statement",
      { params: { iban } }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while fetching the account statement",
      data: [],
    };
  }
};

export const getAccountInfo = async (): Promise<AccountInfo> => {
  const iban = getOrCreateIBAN();
  try {
    const response = await api.get<ApiResponse<AccountInfo>>(
      "api/accounts/account-info",
      { params: { iban } }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch account information"
      );
    }
  } catch (error) {
    throw new Error("An error occurred while fetching account information");
  }
};

export const getOtherIBANs = async (): Promise<string[]> => {
  const currentIBAN = getOrCreateIBAN();
  try {
    const response = await api.get<ApiResponse<string[]>>(
      "api/accounts/other-ibans",
      {
        params: { currentIBAN },
      }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch other IBANs");
    }
  } catch (error) {
    console.error("Error fetching other IBANs:", error);
    return [];
  }
};
