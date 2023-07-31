import { Source, Layer, Popup, useMap } from "react-map-gl";
import React, { useState, useEffect } from "react";
import { IconActivity } from "@tabler/icons";
import { Menu } from "@mantine/core";
import "../../../../src/index.css";
import { signal } from "@preact/signals";
import { loadModules } from 'esri-loader';


export const _selectedEarthquack = signal(null);
export const MyFeatureLayer = (props) => {
    const [myFeatureLayer, setMyFeatureLayer] = useState(null);

    useEffect(() => {
        loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
            const myFeatureLayer = new FeatureLayer({
                url: props.featureLayerProperties.url
            });

            setMyFeatureLayer(myFeatureLayer);
            props.map.add(myFeatureLayer);
        }).catch((err) => console.error(err));

        return function cleanup() {
            props.map.remove(myFeatureLayer);
        }
    }, [props]);

    return null;
};
export default function Earthquake() {
  const [earthquakes, setEarthquakes] = useState(null);
  const [showEarthquake, setShowEarthquake] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedMenuOption, setSelectedMenuOption] = useState("");

  const map = useMap().current;
  
  useEffect(() => {
    if (!showEarthquake) {
      _selectedEarthquack.value = null;
    }
  }, [showEarthquake]);
  useEffect(() => {
    let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";
    switch (selectedMenuOption) {
      case "last_week":
        url += "all_week.geojson";
        break;
      case "last_day":
        url += "all_day.geojson";
        break;
      case "last_month":
      default:
        url += "all_month.geojson";
        break;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEarthquakes(data);
      });
    map.on("mousemove", "earthquake-layer", (event) => {
      if (earthquakes) {
        const feature = map.queryRenderedFeatures(event.point, {
          layers: ["earthquake-layer"],
        })[0];
        setSelectedFeature(feature);
      }
    });

    map.on("mouseout", "earthquake-layer", () => {
      setSelectedFeature(null);
    });

    map.on("click", "earthquake-layer", (event) => {
      if (earthquakes) {
        const feature = map.queryRenderedFeatures(event.point, {
          layers: ["earthquake-layer"],
        })[0];
        setSelectedFeature(feature);
      }
    });
  }, [selectedMenuOption]);

  const handleMenuClick = (option) => {
    console.log({ option });
    if (option === selectedMenuOption) {
      _selectedEarthquack.value = null;
      setShowEarthquake(!showEarthquake);
    } else {
      setShowEarthquake(true);
      setSelectedMenuOption(option);
    }
  };

  let headingText;
  const headingTextMap = {
    last_day: "Earthquakes Last 24 Hours",
    last_week: "Earthquakes Last Week",
    last_month: "Earthquakes Last Month",
  };

  if (showEarthquake) {
    headingText = headingTextMap[selectedMenuOption];
    _selectedEarthquack.value = headingText;
  } else {
    _selectedEarthquack.value = null;
  }

  return (
    <>
      {/* {showEarthquake && <h1 className="layer-heading">{headingText}</h1>} */}
      <Menu position="left-end" withArrow>
        <Menu.Target>
          <div className="  hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer    z-70   p-3 rounded-full text-white bg-components shadow-lg">
            <IconActivity size={30} />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => handleMenuClick("last_day")}
            active={selectedMenuOption === "last_day"}
          >
            Earthquake Last 24 Hours
          </Menu.Item>
          <Menu.Item
            onClick={() => handleMenuClick("last_week")}
            active={selectedMenuOption === "last_week"}
          >
            Earthquake Last Week
          </Menu.Item>

          <Menu.Item
            onClick={() => handleMenuClick("last_month")}
            active={selectedMenuOption === "last_month"}
          >
            Earthquake Last Month
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {showEarthquake && (
        <Source type="geojson" data={earthquakes}>
          <Layer
            id="earthquake-layer"
            type="circle"
            interactive={true}
            paint={{
              "circle-color": [
                "case",
                [">", ["get", "mag"], 7.5],
                "rgb(36, 36, 36)",
                [">", ["get", "mag"], 6],
                "rgb(252, 3, 22)",
                [">", ["get", "mag"], 4.5],
                "rgb(242, 230, 67)",
                [">", ["get", "mag"], 3],
                "rgb(108, 234, 230)",
                ["<", ["get", "mag"], 3],
                "rgb(168, 168, 168)",
                "rgb(168, 168, 168)",
              ],
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1,
                4,
                6,
                8,
                10,
                8.5,
                12,
                9,
                16,
                9.5,
                20,
                10,
                24,
                11,
              ],
            }}
          />
        </Source>
      )}
      {selectedFeature && (
        <Popup
          longitude={selectedFeature.geometry.coordinates[0]}
          latitude={selectedFeature.geometry.coordinates[1]}
          onClose={() => setSelectedFeature(null)}
          className="popup-earthquake"
        >
          <h2 style={{ fontWeight: "bold" }}></h2>
          <div style={{ width: "220px", height: "150px", textAlign: "left" }}>
            <div style={{ fontSize: "16px", color: "#cd9900" }}>
              Magnitude:{selectedFeature.properties.mag} Earthquake
            </div>{" "}
            <br />
            <div>
              {" "}
              Time:
              <br />
              <h2>
                {new Date(selectedFeature.properties.time).toLocaleString("en-GB", {
                  timeZone: "Asia/Karachi",
                })}
              </h2>
            </div>
            <br />
            <div>
              Location: <br /> <h2>{selectedFeature.properties.place}</h2>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
