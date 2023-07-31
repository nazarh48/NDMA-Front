import { Menu } from "@mantine/core";
import { IconMap } from "@tabler/icons";
import { mapStyle } from "./Map";

export default () => {
  return (
    <Menu position="left-end" withArrow>
      <Menu.Target>
        <div className=" hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer  z-70  p-3 rounded-full text-white bg-components ">
          <IconMap size={30} />
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() =>
            (mapStyle.value =
              "https://api.maptiler.com/maps/outdoor/style.json?key=Fbb9bsvj7tIEC7vzB2TD")
          }
        >
          Outdoor
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            (mapStyle.value = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json")
          }
        >
          Streets
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            (mapStyle.value = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json")
          }
        >
          Dark
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            (mapStyle.value = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json")
          }
        >
          Light
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            (mapStyle.value =
              "https://api.maptiler.com/maps/hybrid/style.json?key=Fbb9bsvj7tIEC7vzB2TD")
          }
        >
          3D Map
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
