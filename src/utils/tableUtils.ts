import { Transaction } from "../types/transaction";

export type Order = "asc" | "desc";

export const sortTransactions = (
  transactions: Transaction[],
  orderBy: keyof Transaction,
  order: Order
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    const aValue = a[orderBy] ?? "";
    const bValue = b[orderBy] ?? "";

    if (bValue < aValue) {
      return order === "asc" ? 1 : -1;
    }
    if (bValue > aValue) {
      return order === "asc" ? -1 : 1;
    }
    return 0;
  });
};

export const filterTransactions = (
  transactions: Transaction[],
  filter: string
): Transaction[] => {
  const lowerFilter = filter.toLowerCase();
  return transactions.filter(
    (transaction) =>
      (transaction.type?.toLowerCase() ?? "").includes(lowerFilter) ||
      (transaction.amount?.toString() ?? "").includes(lowerFilter) ||
      (transaction.balance?.toString() ?? "").includes(lowerFilter) ||
      (new Date(transaction.date ?? "").toLocaleDateString() ?? "").includes(
        lowerFilter
      )
  );
};
