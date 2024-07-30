import React from "react";
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
import Card from "./Card";
import { useStatement } from "../hooks/useStatement";

const StatementForm: React.FC = () => {
  const { error, filter, filteredRows, handleFilterChange } = useStatement();
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

export default StatementForm;