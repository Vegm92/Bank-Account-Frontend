import { useState, useEffect, useMemo } from "react";
import { getStatement } from "../services/api";
import { Transaction } from "../types/transaction";
import { filterTransactions } from "../utils/tableUtils";

export const useStatement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getStatement();
        if (response.success && Array.isArray(response.data)) {
          const processedTransactions = response.data.map(
            (transaction, index) => ({
              id: index,
              ...transaction,
              type: transaction.type || "Unknown",
            })
          );
          setTransactions(processedTransactions);
        } else {
          setError("Failed to fetch transactions");
        }
      } catch (err) {
        setError("An error occurred while fetching transactions");
      }
    };

    fetchTransactions();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const filteredRows = useMemo(() => {
    return filterTransactions(transactions, filter);
  }, [transactions, filter]);

  return {
    transactions,
    error,
    filter,
    filteredRows,
    handleFilterChange,
  };
};
