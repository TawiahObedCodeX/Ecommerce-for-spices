
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminFloatingNavbar from "../Components/AdminFloatingNavbar";
import Loading from "../Components/Loading";

export default function DashboardAdmin() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading on page refresh
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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