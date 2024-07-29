import React, { useEffect } from "react";
import { TextField, Button, Typography, Grid, Alert } from "@mui/material";

import { useTransaction } from "../hooks/useTransaction";
import Card from "./Card";

interface TransactionFormProps {
  type: "Deposit" | "Withdraw";
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type }) => {
  const {
    amount,
    setAmount,
    error,
    success,
    balance,
    handleTransaction,
    refreshBalance,
  } = useTransaction(type);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleTransaction();
  };

  return (
    <Card title={`${type} Funds`}>
      {balance !== null && (
        <Typography variant="subtitle1" gutterBottom>
          Current Balance: {balance.toFixed(2)} €
        </Typography>
      )}
      <Grid component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAmount(e.target.value)
          }
          fullWidth
          margin="dense"
          required
          inputMode="numeric"
          sx={{ mb: 4 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {type === "Deposit" ? "Deposit" : "Withdraw"}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Grid>
    </Card>
  );
};

export default TransactionForm;
