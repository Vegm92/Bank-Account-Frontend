import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Statement from "./pages/Statement";
import { CssBaseline } from "@mui/material";
import Transfer from "./pages/Transfer";

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/transfer" element={<Transfer />} />
      </Routes>
    </Router>
  );
};

export default App;
