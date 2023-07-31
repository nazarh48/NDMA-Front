import React, { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { signal } from "@preact/signals";
import Tooltip from "@mui/material/Tooltip";
import { AiFillCaretDown } from "react-icons/ai";
export const toggleNav = signal(true);

const Nav = () => {
  const [isOnMapScreen, setIsOnMapScreen] = React.useState(false);
  const hideMapWhen = ["/map", "/Windy"];
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated, setUser, user } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem("NCOP-Auth-Token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  const redirect = () => {
    if (window.location.pathname == "/map") {
    }
  };

  const navItems = [
    {
      name: "Map",
      path: "/map",
      canActivate: isAuthenticated,
    },
    {
      name: "User Management",
      path: "/user-management",
      canActivate: isAuthenticated && user?.isAdmin,
    },
    {
      name: "Departments",
      path: "/departments",
      canActivate: isAuthenticated && user?.isAdmin,
    },
    {
      name: "Event Dashboard",
      path: "/event-dashboard",
      canActivate: isAuthenticated,
    },
    {
      name: "Alert Registration",
      path: "/DisasterRegistration",
      canActivate: isAuthenticated,
    },
    {
      name: "Incident Registration",
      path: "/IncidentRegistration",
      canActivate: isAuthenticated,
    },
    {
      name: "Windy",
      path: "/Windy",
      canActivate: isAuthenticated,
    },
    {
      name: "Satellite",
      path: "/Satellite",
      children: [
        { name: "NASA", path: "Satellite/Nasa" },
        { name: "SkyWatch", path: "Satellite/SkyWatch" },
        { name: "SUPARCO", path: "Satellite/Sparco" },
      ],
      canActivate: isAuthenticated,
    },
    {
      name: "Access Control",
      path: "/access-control",
      canActivate: isAuthenticated,
    },
    // {
    //   name: "Incident Map",
    //   path: "/IncidentMap",
    //   canActivate: isAuthenticated,
    // }
  ];

  useEffect(() => {
    setTimeout(() => {
      if (hideMapWhen.includes(location.pathname)) {
        toggleNav.value = true;
        setIsOnMapScreen(true);
      } else {
        toggleNav.value = false;
        setIsOnMapScreen(false);
      }
    }, 2000);
  }, [location.pathname]);

  return (
    <>
      <div className="hidden lg:block md:block">
        {toggleNav.value && (
          <Tooltip title="Show Navbar" placement="right">
            <i
              className="fa-solid fa-bars text-black text-2xl  hover:text-zinc-700 transition-colors cursor-pointer absolute z-10 top-5 left-2 z-70"
              onClick={() => {
                toggleNav.value = false;
              }}
            ></i>
          </Tooltip>
        )}
      </div>
      <div className="block  lg:hidden md:hidden">
        {toggleNav.value && (
          <Tooltip title="Show Navbar" placement="right">
            <i className="fa-solid fa-bars text-black text-2xl  hover:text-zinc-700 transition-colors cursor-pointer absolute z-10 top-5 left-2 z-70"></i>
          </Tooltip>
        )}
      </div>
      {!toggleNav.value && (
        <nav className="bg-gray-200  w-full sticky border-b-2 z-40 ">
          <div className=" ml-2">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex gap-7 items-center">
                  {/* {isOnMapScreen && ( */}
                  <i
                    className="fa-solid fa-bars text-black text-2xl mr-3 hover:text-zinc-700 transition-colors cursor-pointer"
                    onClick={() => {
                      toggleNav.value = true;
                      
                    }}
                  ></i>
                  {/* )} */}

                  <Link className="text-white font-bold text-xl" to="/map">
                    <img src="/logoPng.png" alt="logo" className="h-10 object-cover" />
                  </Link>
                </div>
                <div className="hidden md:block">
                  <ul className="ml-10 flex items-center space-x-4">
                    {navItems.map(
                      (item, index) =>
                        item.canActivate && (
                          <li
                            key={index}
                            className={`hover:bg-gray-300 hover:text-black p-2 rounded-lg transition-colors mainNav ${
                              location.pathname.includes(item.path) && "bg-gray-300 "
                            }}`}
                          >
                            {item.children && item.children.length > 0 ? (
                              <div className="relative">
                                <NavLink className="text-black">
                                  <div className="flex items-center">
                                    {" "}
                                    {item.name} <AiFillCaretDown className="text-xs ml-1" />
                                  </div>
                                </NavLink>
                                <ul className="absolute left-0 top-full mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-md childNav">
                                  {item.children.map((childItem, childIndex) => (
                                    <li
                                      key={childIndex}
                                      className="hover:bg-gray-300 transition-colors"
                                    >
                                      <NavLink
                                        to={childItem.path}
                                        className="text-black block p-2 childNavAnchor"
                                      >
                                        {childItem.name}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <NavLink to={item.path} className="text-black  ">
                                {item.name}
                              </NavLink>
                            )}
                          </li>
                        ),
                    )}
                  </ul>
                </div>
              </div>
              {isAuthenticated && (
                <div className="mr-2">
                  <button
                    className="bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-2 text-sm text-white text-center"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Nav;
