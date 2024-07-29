import React from "react";
import { Grid } from "@mui/material";
import TransactionForm from "../components/TransactionForm";

const Deposit: React.FC = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      sx={{ p: 4 }}
    >
      <TransactionForm type="Deposit" />
    </Grid>
  );
};

export default Deposit;
