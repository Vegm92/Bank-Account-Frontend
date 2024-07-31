import { useState, useEffect } from "react";
import { validateIBAN } from "../utils/validators";
import { getAccountInfo, getOtherIBANs, transfer } from "../services/api";
import { AccountInfo } from "../types/accountInfo";

export const useTransfer = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [recipientIBAN, setRecipientIBAN] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otherIBANs, setOtherIBANs] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [info, ibans] = await Promise.all([
          getAccountInfo(),
          getOtherIBANs(),
        ]);
        setAccountInfo(info);
        setOtherIBANs(ibans);
      } catch (err) {
        setError("Failed to fetch account information");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateIBAN(recipientIBAN)) {
      setError("Invalid IBAN number");
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    if (accountInfo && transferAmount > accountInfo.balance) {
      setError("Insufficient funds");
      return;
    }

    setLoading(true);
    try {
      const response = await transfer(transferAmount, recipientIBAN);
      if (response.success) {
        setSuccess(
          `Successfully transferred $${transferAmount} to ${recipientIBAN}`
        );
        setAmount("");
        setRecipientIBAN("");

        // Update account info
        if (response.data && typeof response.data.balance === "number") {
          setAccountInfo((prevInfo) =>
            prevInfo
              ? { ...prevInfo, balance: response.data!.balance ?? 0 }
              : null
          );
        } else {
          // If we don't get a balance in the response, fetch updated account info
          const updatedInfo = await getAccountInfo();
          setAccountInfo(updatedInfo);
        }
      } else {
        setError(response.message || "Transfer failed");
      }
    } catch (err) {
      setError("An error occurred while processing your transfer");
    } finally {
      setLoading(false);
    }
  };

  const handleIBANClick = (iban: string) => {
    setRecipientIBAN(iban);
  };

  return {
    accountInfo,
    recipientIBAN,
    amount,
    error,
    success,
    loading,
    otherIBANs,
    handleSubmit,
    setRecipientIBAN,
    setAmount,
    handleIBANClick,
  };
};
