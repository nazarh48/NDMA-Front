import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState, useContext } from "preact/compat";
import useAuth from "../hooks/useAuth";
import React from "preact/compat";

const NoAuth = () => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? <Outlet /> : <Navigate to="/map" />;
};

export default NoAuth;
