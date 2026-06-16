import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BanquetHall from "@/pages/BanquetHall";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BanquetHall />} />
      </Routes>
    </Router>
  );
}
