import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminFloatingNavbar from "../Components/AdminFloatingNavbar";
import Loading from "../Components/Loading";
import { LogOut, ChevronDown } from "lucide-react";
import API_BASE_URL from "../config";

export default function DashboardAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminform");
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        let response = await fetch(`${API_BASE_URL}/auth/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If token expired, try to refresh
        if (response.status === 401) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/admin/refresh`, {
              method: 'POST',
              credentials: 'include', // Include cookies for refresh token
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem('adminToken', refreshData.accessToken);
              token = refreshData.accessToken;

              // Retry the original request with new token
              response = await fetch(`${API_BASE_URL}/auth/admin/me`, {
                headers: { Authorization: `Bearer ${token}` },
              });
            } else {
              throw new Error('Session expired');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem("adminToken");
            navigate("/adminform");
            return;
          }
        }

        if (response.ok) {
          const data = await response.json();
          setAdminName(data.admin.full_name || "Administrator");
        } else {
          throw new Error("Unauthorized");
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        localStorage.removeItem("adminToken");
        navigate("/adminform");
      }
    };

    fetchAdminProfile();
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminform");
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Premium Clean Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 font-medium">Secure • Real-time • Enterprise Grade</p>
            </div>
          </div>

          {/* Right: Admin Profile - Clean & Sophisticated */}
          <div className="flex items-center space-x-5">
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium leading-none">Signed in as</p>
              <p className="text-base font-semibold text-gray-900 mt-0.5">{adminName}</p>
            </div>

            {/* Elegant Avatar + Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium text-sm ring-4 ring-white">
                  {adminName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                    <p className="text-xs text-gray-500">Super Administrator</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <AdminFloatingNavbar />
    </div>
  );
}
