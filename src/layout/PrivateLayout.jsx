import React from "react";
import { Link, Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const PrivateLayout = ({ children }) => {
  return (
    <div>
      <Nav />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateLayout;
