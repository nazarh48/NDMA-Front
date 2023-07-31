import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useEffect } from "preact/hooks";
import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
const SideNavItems = [
  {
    name: "Menu Management",
    path: "menu-management",
    icon: "fa-solid fa-bars",
  },
  {
    name: "Menu Position Management",
    path: "menu-position-management",
    icon: "fa-solid fa-compass",
  },
  {
    name: "Role Management",
    path: "role-management",
    icon: " fa-solid fa-user  ",
  },
];
const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(location);
    if (location.pathname == "/access-control") {
      navigate("/access-control/menu-management");
    }
  }, [location]);
  return (
    <div className="h-screen sticky left-0 bg-gray-200 w-20  ">
      <div className="flex flex-col gap-3 items-center py-3  ">
        {SideNavItems.map((item) => (
          <Tooltip
            TransitionComponent={Zoom}
            title={item.name}
            placement="right"
            className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-black transition-colors duration-300 ease-in-out ${
              location.pathname?.split("/")?.[2] == item.path ? "bg-gray-300 text-black" : ""
            }`}
          >
            <NavLink to={item.path} className="text-black  ">
              <i className={`${item.icon} text-2xl`}></i>
            </NavLink>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // navigate("/event-dashboard/home");
    if (location.pathname == "/event-dashboard") {
      navigate("/event-dashboard/home");
    }
  }, []);
  return (
    <div className="flex ">
      <SideNav />
      <div className="flex flex-col flex-grow p-10 h-screen overflow-auto">{children}</div>
    </div>
  );
};

const index = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
export default index;
