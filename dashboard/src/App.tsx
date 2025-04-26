import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import EmergencyDetails from "./components/EmergencyDetails";
import "./App.scss";

function App() {
  return (
    <Router>
      <div className="app__container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/emergency/:id" element={<EmergencyDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
