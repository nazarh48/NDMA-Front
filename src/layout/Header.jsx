import { Avatar, Burger, Group, Menu } from "@mantine/core";
import { signal } from "@preact/signals";
import { IconLogout } from "@tabler/icons";
import { useContext } from "preact/hooks";
import { useNavigate } from "react-router";
 import { collapsed } from "./Navbar";
export const dropvalue = signal(false);
export default () => {
  const route = useNavigate();
   return (
    <div
      className="absolute shadow-lg border-white border-solid border-2 items-center right-0 left-0 m-2 rounded-2xl top-0 z-10 h-20  flex px-4 bg-components backdrop-blur-2xl"
      style={{ display: "none" }}
    >
      <Burger
        onClick={() => {
          collapsed.value = !collapsed.value;
        }}
        className="mr-4"
        color="white"
        size="sm"
        opened={collapsed.value}
      />

      <div className="flex-grow font-thin text-white text-lg">
        {/* <h6>{route[0].url.replace("/", "").toUpperCase() || "DASHBOARD"}</h6> */}
      </div>
      <Menu width={260} position="bottom-end" transition="pop-top-right">
        <Menu.Target>
          <div className="items-center flex cursor-pointer hover:scale-105 transition-all">
            <Group color="white" spacing={7}>
              <Avatar size="md" radius="xl" />
            </Group>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            color="red"
            icon={<IconLogout size={14} stroke={1.5} />}
            onClick={() => auth.setAuth(false)}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
