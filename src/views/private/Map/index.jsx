import Map from "./Map";
import BaseMapControl from "./BaseMapControl";
import OverlayControl from "./OverlayControl";
import SearchControl from "./SearchControl";
import { useEffect, useState } from "preact/hooks";
import Header from "../../../layout/Header";
import { _selectedLayer } from "./OverlayControl";
import { _selectedEarthquack } from "./Earthquake";
import { _selectedWeather } from "./WeatherWidget";
import { IconCloud, IconStack2, IconActivity } from "@tabler/icons";

const SelectedInfo = () => {
  useEffect(()=>{console.log(_selectedLayer.value)},[_selectedLayer])
  const items = [
    {
      icon: <IconStack2 size={20} className="bg-[#98C688] text-white p-1 rounded" />,
      title: _selectedLayer.value
         ,
      visible: _selectedLayer.value ? true : false,
    },
    {
      icon: <IconCloud size={20} className="bg-[#98C688] text-white p-1 rounded" />,
      title: _selectedWeather.value,
      visible: _selectedWeather.value ? true : false,
    },
    {
      icon: <IconActivity size={20} className="bg-[#98C688] text-white p-1 rounded" />,
      title: _selectedEarthquack.value,
      visible: _selectedEarthquack.value ? true : false,
    },
  ];

  return (
    <>
      {(_selectedEarthquack.value || _selectedLayer.value || _selectedWeather.value) && (
        <div className="flex absolute top-19 z-10 justify-center text-black headinglayers">
          <div className="bg-white px-3 py-1 rounded-lg flex gap-2">
            {items.map((item, index) => (
              <div
                className={`${item.visible ? "flex flex-row gap-1 items-center" : "hidden"}  `}
                key={index}
              >
                {item.icon}:<h2 className="font-bold capitalize">{item.title}</h2>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
const EarthquakeLegends = () => {
  return (
    <>
      {_selectedEarthquack.value && (
        <div className="absolute z-10 bottom-2 left-2 bg-white rounded-lg px-2 py-2 text-black">
          <h3>Earthquake Magnitude</h3>
          <div>
            <span
              className="legend-circle mag7"
              style={{ backgroundColor: "rgb(36, 36, 36)" }}
            ></span>
            <span>Mag &gt; 7.5</span>
          </div>
          <div>
            <span
              className="legend-circle mag6"
              style={{ backgroundColor: "rgb(252, 3, 22)" }}
            ></span>
            <span>Mag 6.1 to 7.4</span>
          </div>
          <div>
            <span
              className="legend-circle mag5"
              style={{ backgroundColor: "rgb(242, 230, 67)" }}
            ></span>
            <span>Mag 4.6 to 6.0</span>
          </div>
          <div>
            <span
              className="legend-circle mag4"
              style={{ backgroundColor: "rgb(108, 234, 230)" }}
            ></span>
            <span>Mag 3.0 to 4.5</span>
          </div>
          <div>
            <span
              className="legend-circle mag3"
              style={{ backgroundColor: "rgb(168, 168, 168)" }}
            ></span>
            <span>Mag &lt; 3.0</span>
          </div>
        </div>
      )}
    </>
  );
};
export default () => {
  return (
    <div>
      <SelectedInfo />
      <EarthquakeLegends />

      <Map />
      {/* <div className="absolute">
        <BaseMapControl />

        <OverlayControl />
      </div> */}
    </div>
  );
};
