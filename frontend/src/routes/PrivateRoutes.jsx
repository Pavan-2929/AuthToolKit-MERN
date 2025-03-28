import Navbar from "@/components/Navbar";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-col justify-between px-4 sm:px-6 lg:px-8">
        {isLoggedIn ? <Outlet /> : <Navigate to="/signin" />}
      </div>
    </>
  );
};

export default PrivateRoutes;
