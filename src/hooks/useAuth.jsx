import { useContext } from "preact/hooks";
import AuthContext from "../providers/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
