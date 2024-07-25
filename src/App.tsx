import "./App.css";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          {/*   <Route path='/' element={<Home />} />
          <Route path='/deposit' element={<Deposit />} />
          <Route path='/withdraw' element={<Withdraw />} />
          <Route path='/transfer' element={<Transfer />} />
          <Route path='/statement' element={<Statement />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
