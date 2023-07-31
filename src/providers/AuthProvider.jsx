import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import PrivateRoutes from "../routes/PrivateRoutes";
import PublicRoutes from "../routes/PublicRoutes";
import { signal } from "@preact/signals";
import React from "preact/compat";

// const createAuthState = () => {
//   const isAuthenticated = signal(false);
//   const setAuth = (value) => {
//     isAuthenticated = value;
//   };
//   const user = signal({});
//   const setUser = (value) => {
//     user.value = value;
//   };
//   return { isAuthenticated, setAuth, setUser, user };
// };

// export const AuthState = createContext();

// export const AuthProvider = ({ children }) => {
//   useState(() => {
//     console.log("AuthProvider", createAuthState().isAuthenticated);
//   }, [createAuthState().isAuthenticated]);
//   return <AuthState.Provider value={createAuthState()}>{children}</AuthState.Provider>;
// };

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// const AppRoutes = () => {
//   const auth = useContext(AuthState);PrivateRoutes
//   return <>{auth.auth.value ? <PrivateRoutes auth={auth} /> : <PublicRoutes auth={auth} />}</>;
// };
