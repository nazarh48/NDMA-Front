import { useMap } from "react-map-gl";
import BaseMapControl from "./BaseMapControl";
import OverlayControl from "./OverlayControl";
import SearchControl from "./SearchControl";
import MapControls from "./MapControls";
import Windy from "./windy";
import Earthquake from "./Earthquake";
import DataTiles from "./DataTiles";
import WeatherWidget from "./WeatherWidget";
import { IconBrandWindows, IconMenu2, IconActivityHeartbeat } from "@tabler/icons-react";
import ForecastedWeather from "./ForecastedWeather";
import { signal } from "@preact/signals-core";
import { MyFeatureLayer } from "./Earthquake";
import { Map } from "@esri/react-arcgis";
import { useState } from "react";
import Incidents from "./layers/Incidents";
import Tooltip from "@mui/material/Tooltip";

export const toggleNav = signal(true);
const NavShowHide = () => {
  // return (
  // <div
  //   className="hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer  z-70  p-3 rounded-full text-white bg-components"
  //   onClick={() => {
  //     toggleNav.value = !toggleNav.value;
  //   }}
  //   >
  //   <IconMenu2 size={30} />
  // </div>
  // );
};

const IntensityLayer = ({ onclick }) => {
  return (
    <div
      style={{ zIndex: "1" }}
      className="hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer  z-70  p-3 rounded-full text-white bg-components intensity z-1"
      onClick={() => {
        onclick();
      }}
    >
      <IconActivityHeartbeat size={30} />
    </div>
  );
};
const Controls = (props) => {
  const toggleEarthquakeVisibility = () => {
    setIsEarthquakeVisible(!isEarthquakeVisible);
  };
  const [isEarthquakeVisible, setIsEarthquakeVisible] = useState(false);

  const map = useMap().current;
  const components = [
    <NavShowHide />,

    {
      label: "Windy",
      component: (
        <Windy
          showWindy={() => {
            props.showWindy();
          }}
        />
      ),
    },
    {
      label: "Incidents",
      component: <Incidents />,
    },
    {
      label: "Earthquake",
      component: <Earthquake map={map} />,
    },
    {
      label: "Intensity",
      component: (
        <IntensityLayer
          onclick={() => {
            toggleEarthquakeVisibility();
          }}
        />
      ),
    },
    {
      label: "Layers ",
      component: <DataTiles />,
    },
    {
      label: "Forecasted Weather",
      component: <ForecastedWeather />,
    },
    {
      label: "Weather",
      component: <WeatherWidget />,
    },
    {
      label: "Layers",
      component: <OverlayControl />,
    },
    {
      label: "Base Controls",
      component: <BaseMapControl />,
    },
    {
      label: "",
      component: <SearchControl />,
    },
    {
      label: "",
      component: (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: isEarthquakeVisible === true ? "block" : "none",
          }}
        >
          <Map
            mapProperties={{ basemap: "satellite" }}
            viewProperties={{
              center: [-70, 25],
              zoom: 4,
            }}
          >
            <MyFeatureLayer
              featureLayerProperties={{
                url: "https://services9-nocdn.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/USGS_Seismic_Data_v1/FeatureServer/1",
              }}
            ></MyFeatureLayer>
          </Map>
        </div>
      ),
    },
  ];
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "25px",
          left: "30px",
          opacity: "0.3",
          fontSize: "64px",
        }}
      >
        NCOP
      </div>

      <div className="  w-12 flex flex-col">
        <MapControls />
        <div className="absolute  right-5 bottom-10">
          {components.map((element, index) => (
            <Tooltip title={element.label} placement="left">
              <div key={index} className="mb-2">
                {element.component}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </>
  );
};

export default Controls;
