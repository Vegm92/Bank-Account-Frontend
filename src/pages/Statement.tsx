import React, { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Paper,
  TextField,
  Grid,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getStatement } from "../services/api";
import { Transaction } from "../types/transaction";
import Card from "../components/Card";

const Statement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const mobileRowsWidth = isMobile ? 80 : 150;

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: mobileRowsWidth,
      renderCell: (params: GridRenderCellParams) =>
        new Date(params.row.date || "").toLocaleDateString(),
    },
    { field: "type", headerName: "Type", width: mobileRowsWidth },
    {
      field: "amount",
      headerName: "Amount",
      width: mobileRowsWidth,
      align: "right",
      renderCell: (params: GridRenderCellParams) =>
        `$${(params.value as number).toFixed(2)}`,
    },
    {
      field: "balance",
      headerName: "Balance",
      width: mobileRowsWidth,
      align: "right",
      renderCell: (params: GridRenderCellParams) =>
        `$${(params.value as number).toFixed(2)}`,
    },
  ];

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
    return transactions.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [transactions, filter]);

  return (
    <Card title="Account Statement">
      <Box sx={{ minWidth: "280px", overflowX: "hidden" }}>
        <Grid container direction="column" spacing={1} sx={{ px: 2, py: 4 }}>
          <TextField
            label="Filter transactions"
            variant="outlined"
            fullWidth
            value={filter}
            onChange={handleFilterChange}
          />
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : isMobile ? (
            <Paper sx={{ height: 400, width: "100%", padding: 0 }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                disableColumnMenu={isMobile}
                sx={{ fontSize: 10 }}
              />
            </Paper>
          ) : (
            <Paper sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Paper>
          )}
        </Grid>
      </Box>
    </Card>
  );
};

export default Statement;
