import React, { useState, useEffect } from 'react'
import ClientNavbar from '../Components/ClientFloatingNavbar'
import Loading from '../Components/Loading'
import { Outlet, useNavigate } from 'react-router-dom';

export default function DashboardForClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if client is authenticated
    const token = localStorage.getItem("clientToken");
    if (!token) {
      navigate("/clientform");
      return;
    }

    // Fetch client profile to get name
    const fetchClientProfile = async () => {
      try {
        const response = await fetch("http://localhost:5002/auth/client/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setClientName(data.user.full_name);
        } else {
          // Token invalid, redirect to login
          localStorage.removeItem("clientToken");
          navigate("/clientform");
        }
      } catch (error) {
        console.error("Failed to fetch client profile:", error);
        localStorage.removeItem("clientToken");
        navigate("/clientform");
      }
    };

    fetchClientProfile();

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
    <div className='flex flex-col h-screen  '>
      {/* Header with client name */}
      <header className="flex justify-end  mt-4 mr-6 items-center  ">
        <div className="text-right bg-black rounded-2xl px-7 py-2  ">
          <p className="text-sm text-white">Welcome, {clientName || "Client"}</p>
        </div>
      </header>

      <div className='flex-1 overflow-auto'>
        <Outlet />
      </div>
      <ClientNavbar />
    </div>
  )
}