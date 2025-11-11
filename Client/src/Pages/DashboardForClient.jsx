import React, { useState, useEffect } from 'react'
import ClientNavbar from '../Components/ClientFloatingNavbar'
import Loading from '../Components/Loading'
import { Outlet } from 'react-router-dom';

export default function DashboardForClient() {
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
    <div className='flex flex-col h-screen'>
      <div className='flex-1 overflow-auto'>
        <Outlet />
      </div>
      <ClientNavbar />
    </div>
  )
}