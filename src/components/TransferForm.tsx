import React from "react";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import Card from "./Card";
import { useTransfer } from "../hooks/useTransfer";

const TransferForm: React.FC = () => {
  const {
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
  } = useTransfer();

  return (
    <Card
      title="Transfer Funds"
      subtitle={
        accountInfo
          ? `Current Balance: ${accountInfo.balance.toFixed(2)} €`
          : undefined
      }
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recipient IBAN"
              value={recipientIBAN}
              onChange={(e) => setRecipientIBAN(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              Known IBANs for testing:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {otherIBANs.slice(0, 3).map((iban) => (
                <Chip
                  key={iban}
                  label={iban}
                  onClick={() => handleIBANClick(iban)}
                  color={recipientIBAN === iban ? "primary" : "default"}
                  clickable
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Transfer"}
            </Button>
          </Grid>
        </Grid>
      </form>
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
    </Card>
  );
};

export default TransferForm;
