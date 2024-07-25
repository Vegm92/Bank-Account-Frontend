import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";

const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/deposit">
          Deposit
        </Button>
        <Button color="inherit" component={Link} to="/withdraw">
          Withdraw
        </Button>
        <Button color="inherit" component={Link} to="/transfer">
          Transfer
        </Button>
        <Button color="inherit" component={Link} to="/statement">
          Statement
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
