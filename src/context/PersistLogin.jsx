import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "preact/compat";
import _axios from "../components/Axios";
import Loader from "../components/Loader";

const PersistLogin = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await _axios("get", "user/Context", null);

        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data.data.user);
          localStorage.setItem("NCOP-Auth-Token", response.data.data.token);
        }
      } catch (error) {
        localStorage.removeItem("NCOP-Auth-Token");
        setIsAuthenticated(false);
        setUser({});
      } finally {
        setIsLoading(false);
      }
    };
    //   -disable-next-line no-unused-expressions
    !isAuthenticated ? verifyToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <Loader /> : <Outlet />}</>;
};

export default PersistLogin;
