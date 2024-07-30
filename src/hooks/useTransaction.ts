import { useState } from "react";
import { deposit, getAccountInfo, withdraw } from "../services/api";

type TransactionType = "Deposit" | "Withdraw";

export function useTransaction(type: TransactionType) {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);

  const refreshBalance = async () => {
    try {
      const accountInfo = await getAccountInfo();
      setBalance(accountInfo.balance);
    } catch (err) {
      setError("Failed to update balance");
    }
  };

  const handleTransaction = async () => {
    setError("");
    setSuccess("");

    const transactionAmount = parseFloat(amount);

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      setError("Please enter a valid positive number");

      return;
    }

    try {
      if (type === "Withdraw") {
        const accountInfo = await getAccountInfo();
        if (transactionAmount > accountInfo.balance) {
          setError("Insufficient funds");
          return;
        }
      }

      const transactionFunction = type === "Deposit" ? deposit : withdraw;
      const response = await transactionFunction(transactionAmount);

      if (response.success) {
        setSuccess(
          `Successfully ${
            type === "Deposit" ? "Deposited" : "Withdrew"
          } ${amount}€`
        );
        setAmount("");
        if (response.data && typeof response.data.balance === "number") {
          setBalance(response.data.balance);
        } else {
          await refreshBalance();
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(`An error occurred while processing your ${type}.`);
    }
  };

  return {
    amount,
    setAmount,
    error,
    success,
    balance,
    handleTransaction,
    refreshBalance,
  };
}
