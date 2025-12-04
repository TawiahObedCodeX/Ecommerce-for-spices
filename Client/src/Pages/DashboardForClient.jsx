import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ClientNavbar from "../Components/ClientFloatingNavbar";
import Loading from "../Components/Loading";
import { LogOut, ChevronDown, User } from "lucide-react";

export default function DashboardForClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      navigate("/clientform");
      return;
    }

    const fetchClientProfile = async () => {
      try {
        const response = await fetch("http://localhost:5002/auth/client/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setClientName(data.user.full_name || "Client");
        } else {
          throw new Error("Unauthorized");
        }
      } catch {
        localStorage.removeItem("clientToken");
        navigate("/clientform");
      }
    };

    fetchClientProfile();
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    navigate("/clientform");
  };

  // Generate initials for avatar
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Elegant Client Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Left: Brand / Greeting */}
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Client Portal</h1>
              <p className="text-xs text-gray-500 font-medium">
                Hello, {clientName.split(" ")[0]} — welcome back
              </p>
            </div>
          </div>

          {/* Right: Profile Section – Clean & Friendly */}
          <div className="flex items-center space-x-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-600 font-medium leading-none">Signed in as</p>
              <p className="text-base font-semibold text-gray-900 mt-0.5">{clientName}</p>
            </div>

            {/* Avatar + Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition-all duration-200">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm ring-4 ring-white shadow-sm">
                  {initials || <User className="w-5 h-5" />}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{clientName}</p>
                      <p className="text-xs text-gray-500">Client Account</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Floating Bottom Navbar */}
      <ClientNavbar />
    </div>
  );
}