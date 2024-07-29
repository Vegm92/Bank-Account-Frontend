import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Button, Grid } from "@mui/material";
import { getAccountInfo } from "../services/api";
import { getOrCreateIBAN } from "../utils/ibanUtils";
import { Link } from "react-router-dom";
import Card from "../components/Card";

const Home: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<{
    iban: string;
    balance: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const iban = getOrCreateIBAN();
        const info = await getAccountInfo();
        setAccountInfo({ ...info, iban });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch account information");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      {accountInfo && (
        <Card title="Welcome to Your Bank Account">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            sx={{ p: 4 }}
          >
            <Typography variant="h6" gutterBottom>
              Account Details:
            </Typography>
            <Typography variant="body1">IBAN: {accountInfo.iban}</Typography>
            <Typography variant="body1">
              Current Balance: ${accountInfo.balance.toFixed(2)}
            </Typography>
            <Button
              component={Link}
              to="/statement"
              variant="contained"
              sx={{ mt: 2 }}
            >
              View Statements
            </Button>
          </Grid>
        </Card>
      )}
    </>
  );
};

export default Home;
