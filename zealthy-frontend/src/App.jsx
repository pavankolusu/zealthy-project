import { Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import DataTable from "./pages/DataTable";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/data" element={<DataTable />} />
      </Routes>
    </div>
  );
}
