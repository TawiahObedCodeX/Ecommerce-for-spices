
import { Outlet } from "react-router-dom";
import AdminFloatingNavbar from "../Components/AdminFloatingNavbar";

export default function DashboardAdmin() {
  return (
    <div className="min-h-screen ">
      {/* Header */}
    
      {/* Main Content */}
      <main className="relative flex-1 ">
        <Outlet />
      </main>
      <AdminFloatingNavbar />
    </div>
  );
}