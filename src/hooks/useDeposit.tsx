import { useState } from "react";
import { deposit } from "../services/api";

type UseDepositReturn = {
  amount: string;
  setAmount: (value: string) => void;
  error: string;
  success: string;
  handleDeposit: () => Promise<void>;
};

export function useDeposit(): UseDepositReturn {
  const state = useState("");
  const [amount, setAmount] = state;
  const [error, setError] = state;
  const [success, setSuccess] = state;

  const handleDeposit = async () => {
    setError("");
    setSuccess("");

    const amountNumber = parseFloat(amount);

    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    try {
      const response = await deposit(amountNumber);
      if (response.success) {
        setSuccess(`Successfully deposited $${amount}`);
        setAmount("");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("An error occurred while processing your deposit");
    }
  };

  return { amount, setAmount, error, success, handleDeposit };
}
