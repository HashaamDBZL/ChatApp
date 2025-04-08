import { Navigate, Outlet } from "react-router";
import React from "react";

const ProtectedRoute = () => {
  return localStorage.getItem("token") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
