import axios from "axios";
import { getOrCreateIBAN } from "../utils/ibanUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("VITE_API_URL: ", API_URL);

type Transaction = {
  type: string;
  date: string;
  amount: number;
  balance: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export const deposit = async (
  amount: number
): Promise<ApiResponse<{ balance: number }>> => {
  const iban = getOrCreateIBAN();
  try {
    const response = await axios.post<ApiResponse<{ balance: number }>>(
      `${API_URL}/accounts/deposit`,
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
): Promise<ApiResponse<{ balance: number }>> => {
  const iban = getOrCreateIBAN();
  try {
    const response = await axios.post<ApiResponse<{ balance: number }>>(
      `${API_URL}/accounts/withdraw`,
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
): Promise<ApiResponse<{ balance: number }>> => {
  const senderIBAN = getOrCreateIBAN();
  try {
    const response = await axios.post<ApiResponse<{ balance: number }>>(
      `${API_URL}/accounts/transfer`,
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

export const getStatement = async (): Promise<ApiResponse<Transaction[]>> => {
  const iban = getOrCreateIBAN();
  try {
    const response = await axios.get<ApiResponse<Transaction[]>>(
      `${API_URL}/accounts/statement`,
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

export const getAccountInfo = async (): Promise<{
  iban: string;
  balance: number;
}> => {
  const iban = getOrCreateIBAN();
  try {
    const response = await axios.get<ApiResponse<{ balance: number }>>(
      `${API_URL}/accounts/account-info`,
      { params: { iban } }
    );
    if (response.data.success && response.data.data) {
      return { iban, balance: response.data.data.balance };
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
    const response = await axios.get<{ success: boolean; data: string[] }>(
      `${API_URL}/accounts/other-ibans`,
      {
        params: { currentIBAN },
      }
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch other IBANs");
    }
  } catch (error) {
    console.error("Error fetching other IBANs:", error);
    return [];
  }
};
