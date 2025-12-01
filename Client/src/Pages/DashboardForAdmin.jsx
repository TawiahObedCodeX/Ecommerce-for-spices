
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminFloatingNavbar from "../Components/AdminFloatingNavbar";
import Loading from "../Components/Loading";

export default function DashboardAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminform");
      return;
    }

    // Fetch admin profile to get name
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch("http://localhost:5002/auth/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAdminName(data.admin.full_name);
        } else {
          // Token invalid, redirect to login
          localStorage.removeItem("adminToken");
          navigate("/adminform");
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        localStorage.removeItem("adminToken");
        navigate("/adminform");
      }
    };

    fetchAdminProfile();

    // Simulate loading on page refresh
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with admin name */}
      <header className="bg-white shadow-sm border-b px-4 py-3 flex justify-end items-center">
        <div className="text-right">
          <p className="text-sm text-gray-600">Welcome,</p>
          <p className="font-semibold text-gray-800">{adminName || "Admin"}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1">
        <Outlet />
      </main>
      <AdminFloatingNavbar />
    </div>
  );
}