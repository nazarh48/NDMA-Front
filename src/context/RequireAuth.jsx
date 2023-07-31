import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState, useContext } from "preact/hooks";
import useAuth from "../hooks/useAuth";
import React from "preact/compat";
import PrivateLayout from "../layout/PrivateLayout";

const RequireAuth = () => {
  const { isAuthenticated, user } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default RequireAuth;
