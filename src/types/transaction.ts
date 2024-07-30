import { Key } from "react";

export interface Transaction {
  id: Key | null | undefined;
  date?: string;
  amount?: number;
  balance?: number;
  type?: string;
}
export interface TransactionResponse {
  balance?: number;
}
