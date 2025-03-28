import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return <div>{!isLoggedIn ? <Outlet /> : <Navigate to="/" />}</div>;
};

export default AuthRoutes;
