import React from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useDeposit } from "../hooks/useDeposit";

const Deposit: React.FC = () => {
  const { amount, setAmount, error, success, handleDeposit } = useDeposit();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDeposit();
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        mt: 2,
        bgcolor: "rgba(255, 255, 255, 0.913)",
        p: 2,
      }}
    >
      <Typography variant="h4" color="primary" gutterBottom>
        Deposit
      </Typography>
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Deposit
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success" sx={{ mt: 2 }}>
          {success}
        </Typography>
      )}
    </Box>
  );
};

export default Deposit;
