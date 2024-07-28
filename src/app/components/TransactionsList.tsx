"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TransactionData } from "@/app/libs/db";
import axios from "axios";
import {
  DeleteCell,
  DeleteIconButton,
  StyledTable,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/components/style/Table.styled";
import { AccountForm } from "@/app/components/AccountForm";
import { H2 } from "@/app/components/style/Fonts.styled";
import { Trash2 } from "lucide-react";

interface ApiResponse {
  transactions: TransactionData[];
  message?: string;
}

interface TransactionsListProps {
  transactions: TransactionData[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
}

interface TransactionListItemProps {
  transaction: TransactionData;
  onDelete: (id: string) => void;
}

function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/account/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data: ApiResponse = await response.json();
      console.log(`getTransactions:${JSON.stringify(data)}`);
      setTransactions(data.transactions);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      await axios.delete(`/api/account/delete?transactionId=${transactionId}`);
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.id !== transactionId
        )
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction. Please try again.");
    }
  }, []);

  useEffect(() => {
    getTransactions();
  }, [getTransactions, refreshTrigger]);

  const refreshTransactions = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);
  return {
    transactions,
    isLoading,
    error,
    refreshTransactions,
    deleteTransaction,
  };
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  isLoading,
  error,
  onDelete,
}) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const total = transactions.reduce(
    (sum, transaction) =>
      sum +
      (transaction.type === "expense"
        ? -transaction.amount
        : transaction.amount),
    0
  );

  return (
    <>
      <H2>Total ${total}</H2>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Amount</TableHeader>
            <TableHeader colSpan={2}>Description</TableHeader>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </StyledTable>
    </>
  );
};

const TransactionListItem: React.FC<TransactionListItemProps> = ({
  transaction,
  onDelete,
}) => {
  const handleDelete = () => {
    if (transaction.id !== undefined) {
      onDelete(transaction.id);
    } else {
      console.error("Attempted to delete a transaction without an id");
    }
  };

  return (
    <TableRow>
      <TableCell>
        $
        {transaction.type === "expense"
          ? -transaction.amount
          : transaction.amount}
      </TableCell>
      <TableCell>{transaction.description}</TableCell>
      <DeleteCell>
        <DeleteIconButton
          onClick={handleDelete}
          aria-label="Delete transaction"
        >
          <Trash2 size={18} />
        </DeleteIconButton>
      </DeleteCell>
    </TableRow>
  );
};

const AccountSection: React.FC = () => {
  const {
    transactions,
    isLoading,
    error,
    refreshTransactions,
    deleteTransaction,
  } = useTransactions();

  return (
    <>
      <AccountForm refreshTransactions={refreshTransactions} />
      <TransactionsList
        transactions={transactions}
        isLoading={isLoading}
        error={error}
        onDelete={deleteTransaction}
      />
    </>
  );
};

export { TransactionsList, useTransactions, AccountSection };
export type { TransactionsListProps };
