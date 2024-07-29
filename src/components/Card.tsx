import React from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface CardFormProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardFormProps> = ({ title, subtitle, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: isMobile ? 100 : 300,
        minWidth: isMobile ? 200 : 500,
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          p: isMobile ? 0 : 4,
        }}
      >
        <Grid item xs={12} md={8} lg={6} sx={{ width: "100%" }}>
          <Typography variant="h4" gutterBottom align="center">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" gutterBottom align="center">
              {subtitle}
            </Typography>
          )}
          <Paper
            elevation={3}
            sx={{ p: isMobile ? 0 : 2, mt: 3, width: "100%" }}
          >
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Card;
