import React, { useEffect } from "preact/compat";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./app.css";
import NoAuth from "./context/NoAuth";
import PersistLogin from "./context/PersistLogin";
import RequireAuth from "./context/RequireAuth";
import Outlet from "./layout/Outlet";
import PrivateLayout from "./layout/PrivateLayout";
import { AuthProvider } from "./providers/AuthProvider";
import ActivityDashboardLayout from "./views/private/EventDashboard";
import Departments from "./views/private/Departments";
import Map from "./views/private/Map";
import UserManagement from "./views/private/UserManagement/UserManagement";
import Login from "./views/public/Login";
import Alert from "./views/private/EventDashboard/Alert";
import Activity from "./views/private/EventDashboard/Activity";
import ActivityMaster from "./views/private/EventDashboard/ActivityMaster";
import AlertType from "./views/private/EventDashboard/AlertType";
import Warehouse from "./views/private/EventDashboard/Warehouse";
import InventoryManagement from "./views/private/EventDashboard/InventoryManagement";
import DisasterRegistration from "./views/private/DisasterRegistration/DisasterRegistration";
import ActivityStatus from "./views/private/EventDashboard/ActivityStatus";
import Home from "./views/private/EventDashboard/Home";
import IncidentRegistration from "./views/private/IncidentRegistration/IncidentRegistration";
import IncidentMap from "./views/private/IncidentMap/IncidentMap";
import WorldView from "./views/private/worldView/worldView";
import AlertDetailView from "./views/private/EventDashboard/Home/DetailView";
import WindyView from "./views/private/Map/WindyView";
import ActivityInfo from "./views/private/EventDashboard/ActivityInfo";
import ActivityDashboard from "./views/private/EventDashboard/ActivityDashboard";
import AccessControl from "./views/private/AccessControl";
import RoleManagement from "./views/private/AccessControl/RoleManagement";
import MenuManagement from "./views/private/AccessControl/MenuManagement";
import MenuPositionManagement from "./views/private/AccessControl/MenuPositionManagement";

import RoleDetailView from "./views/private/AccessControl/RoleManagement/DetailView";
import Hazards from "./views/private/EventDashboard/Hazard";
import ReportingSources from "./views/private/EventDashboard/ReportingSource";
import Tiers from "./views/private/EventDashboard/Tier";
import VulnerableEntity from "./views/private/EventDashboard/VulnerableEntity";
import EventSeverities from "./views/private/EventDashboard/EventSeverity";
import Event from "./views/private/EventDashboard/Event";
import AddUpdateEvent from "./views/private/EventDashboard/Event/AddUpdateEvent";
import MapDemo from "./views/private/EventDashboard/Event/MapDemo";
import EventDetailView from "./views/private/EventDashboard/Event/DetailView";
import EventTypes from "./views/private/EventDashboard/EventType";
import Skywatch from "./views/private/SkyWatch/SkyWatch";
export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/map");
    }
  }, []);

  const protectedRoutes = [
    {
      path: "/",
      element: <PrivateLayout />,
      children: [
        {
          path: "/map",
          element: <Map />,

          children: [],
        },
        {
          path: "/user-management",
          element: <UserManagement />,

          children: [],
        },
        {
          path: "/departments",
          element: <Departments />,

          children: [],
        },
        {
          path: "/DisasterRegistration",
          element: <DisasterRegistration />,

          children: [],
        },
        {
          path: "/IncidentRegistration",
          element: <IncidentRegistration />,

          children: [],
        },
        {
          path: "/Satellite",

          children: [
            {
              path: "/Satellite/Nasa",
              element: <WorldView />,
            },
            {
              path: "/Satellite/SkyWatch",
              element: <Skywatch />,
            },
          ],
        },
        {
          path: "/IncidentMap",
          element: <IncidentMap />,

          children: [],
        },
        {
          path: "/event-dashboard/*",
          element: <ActivityDashboardLayout />,

          children: [
            {
              path: "home",
              element: <Home />,
            },
            {
              path: "event-types",
              element: <EventTypes />,
            },
            {
              path: "alertDetailView/:id",
              element: <AlertDetailView />,
            },
            {
              path: "event-detail-view/:id",
              element: <EventDetailView />,
            },
            {
              path: "alert",
              element: <Alert />,
            },
            {
              path: "activity-master",
              element: <ActivityMaster />,
            },
            {
              path: "activity-status",
              element: <ActivityStatus />,
            },

            {
              path: "alert-types",
              element: <AlertType />,
            },
            {
              path: "warehouses",
              element: <Warehouse />,
            },
            {
              path: "activity-dashboard",
              element: <ActivityDashboard />,
            },
            {
              path: "inventory-management",
              element: <InventoryManagement />,
            },
            {
              path: "activityInfo/:id",
              element: <ActivityInfo />,
            },
            //events
            {
              path: "events",
              element: <Event />,
            },
            {
              path: "events/add-event",
              element: <AddUpdateEvent />,
            },
            {
              path: "events/edit-event/:id",
              element: <AddUpdateEvent />,
            },
            {
              path: "events/map-demo",
              element: <MapDemo />,
            },
            {
              path: "hazards",
              element: <Hazards />,
            },
            {
              path: "reporting-sources",
              element: <ReportingSources />,
            },
            {
              path: "tiers",
              element: <Tiers />,
            },
            {
              path: "vulnerable-entities",
              element: <VulnerableEntity />,
            },
            {
              path: "event-severities",
              element: <EventSeverities />,
            },
          ],
        },
        {
          path: "/access-control",
          element: <AccessControl />,
          children: [
            {
              path: "role-management",
              element: <RoleManagement />,
            },
            {
              path: "menu-management",
              element: <MenuManagement />,
            },
            {
              path: "menu-position-management",
              element: <MenuPositionManagement />,
            },
            {
              path: "add-role",
              element: <RoleDetailView />,
            },
            {
              path: "role-detail-view/:id",
              element: <RoleDetailView />,
            },
          ],
        },
        {
          path: "/Windy",
          element: <WindyView />,

          children: [],
        },
      ],
    },
  ];

  const PublicRoutes = [
    {
      path: "/login",
      component: Login,
    },
  ];

  return (
    <>
      <Routes>
        <Route element={<Outlet />}>
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              {protectedRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element}>
                  {route.children?.map((child) => (
                    <Route key={child.path} path={child.path} element={child.element}>
                      {child.children?.map((child2) => (
                        <Route key={child2.path} path={child2.path} element={child2.element} />
                      ))}
                    </Route>
                  ))}
                </Route>
              ))}
            </Route>
            <Route element={<NoAuth />}>
              {PublicRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={<route.component />} />
              ))}
            </Route>
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}
