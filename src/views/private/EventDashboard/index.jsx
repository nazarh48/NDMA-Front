import { useEffect } from "preact/hooks";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import { NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import React from "react";
const SideNavItems = [
  { name: "Home", path: "home", icon: "fa-solid fa-home" },
  {
    name: "Alert",
    path: "alert",
    icon: "fa-solid fa-bell",
  },
  // {
  //   name: "Activity Master",
  //   path: "activity-master",
  //   icon: " fa-solid fa-chart-line  ",
  // },
  // {
  //   name: "Activity Status",
  //   path: "activity-status",
  //   icon: " fa-brands fa-usps",
  // },
  // {
  //   name: "Alert Types",
  //   path: "alert-types",
  //   icon: " fa-solid fa-hurricane",
  // },
  // {
  //   name: "Warehouses",
  //   path: "warehouses",
  //   icon: " fa-solid fa-industry",
  // },
  // {
  //   name: "Inventory Management",
  //   path: "inventory-management",
  //   icon: " fa-solid fa-truck-moving ",
  // },
  {
    name: "Events",
    path: "events",
    icon: "fa-solid fa-cloud-moon-rain",
  },
  {
    name: "Event Types",
    path: "event-types",
    icon: "fa-brands fa-wpforms",
  },
  {
    name: "Hazards",
    path: "hazards",
    icon: "fa-solid fa-triangle-exclamation",
  },
  {
    name: "Reporting Sources",
    path: "reporting-sources",
    icon: "fa-solid fa-rss",
  },
  {
    name: "Tiers",
    path: "tiers",
    icon: "fa-brands fa-intercom",
  },

  {
    name: "Vulnerable Entity",
    path: "vulnerable-entities",
    icon: "fa-solid fa-building-user",
  },
  {
    name: "Event Severities",
    path: "event-severities",
    icon: "fa-solid fa-shield-halved",
  },
];

const SideNav = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(location);
  }, []);
  return (
    <div className="h-screen sticky left-0 bg-gray-200 w-20  overflow-y-scroll">
      <div className="flex flex-col gap-3 items-center py-3 ">
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
