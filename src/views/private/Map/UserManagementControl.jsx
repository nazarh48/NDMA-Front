import { IconUser } from "@tabler/icons";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@mantine/core";
import useAuth from "../../../hooks/useAuth";
const UserManagementControl = () => {
  const navigate = useNavigate();
  const { setAuth, setUser, user } = useAuth();

  const logout = () => {
    localStorage.removeItem("NCOP-Auth-Token");
    setAuth(false);
    setUser(null);
    navigate("/login");
  };
  return (
    <Menu position="left-end" withArrow>
      <Menu.Target>
        <div className="right-2 hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer comparison mb-5 z-70 absolute p-3 rounded-full text-white bg-components shadow-lg">
          <IconUser size={30} />
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        {user?.value?.isAdmin && (
          <Menu.Item
            onClick={() => {
              navigate("/user-management");
            }}
          >
            User Management
          </Menu.Item>
        )}
        <Menu.Item
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserManagementControl;
