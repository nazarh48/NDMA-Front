import react from "react";
import { useState } from "preact/hooks";
import { signal } from "@preact/signals";
import Wmslayer from "./layers/wmslayer";
import { test } from "./OverlayControl";
import { useEffect } from "react";
import { Layer, Popup, Source, useMap } from "react-map-gl";
import { Text, Center } from "@mantine/core";
import { IconSearch, IconAdjustmentsOff } from "@tabler/icons-react";
import "../../../index.css";
import { object } from "prop-types";

export const visibility = signal();

export default function Map() {
  const [localTest, setLocalTest] = useState(test.value);
  const map = useMap()?.current;

  const [latlng, setLatlng] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [activeLayer, setActiveLayer] = useState([]);
  const [newactivelayer, setNewactivelayer] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [useFilter, setUseFilter] = useState(false);
  const [filterData, setFilterData] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false);
  var lastLayer;



  useEffect(() => {
    map.on("mousemove", function (e) {
      const { x, y } = e.point;
      const canvas = map.getCanvas();
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const bbox = map.getBounds().toArray().join(",");

      if (lastLayer) {
        const url = `http://ndma.ddns.net:8600/geoserver/${lastLayer.workspace}/wms?service=WMS&version=1.1.0&request=GetFeatureInfo&INFO_FORMAT=application/json&LAYERS=${lastLayer.label}&QUERY_LAYERS=${lastLayer.label}&X=${x}&Y=${y}&width=${width}&height=${height}&BBOX=${bbox}`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data?.features.length != 0) {
              map.getCanvas().style.cursor = "crosshair";
            } else {
              map.getCanvas().style.cursor = "";
            }
          });
      }
    });
    map.on("click", function (e) {
      const { x, y } = e.point;
      const canvas = map.getCanvas();
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      const tileSize = 256;
      const bbox = map.getBounds().toArray().join(",");
      test.value.map((layer) => {
        if (layer.visible == true) {
          activeLayer.push(layer);
          console.log("active layer", activeLayer);
          lastLayer = activeLayer[activeLayer.length - 1];
        }
      });
      const url = `http://ndma.ddns.net:8600/geoserver/${lastLayer.workspace}/wms?service=WMS&version=1.1.0&request=GetFeatureInfo&INFO_FORMAT=application/json&LAYERS=${lastLayer.label}&QUERY_LAYERS=${lastLayer.label}&X=${x}&Y=${y}&width=${width}&height=${height}&BBOX=${bbox}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setFilterData(data);
          if (data?.features.length != 0) {
            setNewactivelayer(lastLayer.label);
            setPopupInfo(data);
            setLatlng(e);
          } else {
            setPopupInfo(null);
          }
        });
    });
  }, []);
  const handleToggleFilter = () => {
    setUseFilter(!useFilter);
  };

  const handleApplyClick = () => {
    const userInput = document.getElementById("cqlFilterInput").value;
    const encodedCqlFilter = encodeURIComponent(userInput);

    const updatedTiles = test.value.map((layer) => {
      if (layer.visible) {
        const tileUrl = `http://ndma.ddns.net:8600/geoserver/${
          layer.workspace
        }/wms?service=WMS&version=1.1.0&request=GetMap&layers=${
          layer.name
        }&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG%3A3857&format=image/png&transparent=true${
          userInput ? `&CQL_FILTER=${encodedCqlFilter}` : ""
        }`;

        fetch(tileUrl)
          .then((response) => response.json())
          .then((data) => {
            setFilterData(data.features);
            console.log("qwerty", data.features);
          });

        return tileUrl;
      }

      return null;
    });

    setTiles(updatedTiles);
  };

  return (
    <>
      {useFilter === true ? (
        <>
          {test.value.map((layer) =>
            layer.visible ? (
              <>
                <div style={{ position: "fixed", top: "2%", right: "6%" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="cqlFilterInput"
                      type="text"
                      placeholder="Enter CQL Filter"
                      list="suggestions"
                      style={{
                        padding: "6.5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px 0 0 4px",

                        fontSize: "16px",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={handleApplyClick}
                      style={{
                        padding: "5px ",
                        backgroundColor: "#4CAF50",
                        backgroundImage:
                          "linear-gradient(45deg, #787878 0%, #a8ee90 100%)",
                        color: "white",
                        border: "1px solid #ccc",
                        borderRadius: "0 4px 4px 0",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    >
                      <IconSearch />
                    </button>
                  </div>

                  <datalist id="suggestions">
                    {Object.entries(
                      filterData?.features?.[0]?.properties || {}
                    ).map(([key, value]) => (
                      <option key={key}>{key}</option>
                    ))}
                  </datalist>

                  {tiles.map((tileUrl, index) => {
                    if (tileUrl) {
                      return (
                        <div key={index}>
                          <Source
                            id={`layer-${index}`}
                            type="raster"
                            tiles={[tileUrl]} // Pass the tile URL as an array
                            tileSize={256}
                          />
                          <Layer
                            id={`layer-${index}`}
                            type="raster"
                            source={`layer-${index}`}
                            paint={{}}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            ) : (
              <></>
            )
          )}
        </>
      ) : (
        <>
          {test.value.map((layer) =>
            layer.visible ? (
              <div
                key={layer.name}
                onMouseEnter={() => setActiveLayer()}
                onMouseLeave={() => setActiveLayer()}
              >
                <Source
                  id={`${layer.name}-source`}
                  type="raster"
                  tiles={[
                    `http://ndma.ddns.net:8600/geoserver/${layer.workspace}/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layer.name}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG%3A3857&format=image/png&transparent=true`,
                  ]}
                  tileSize={256}
                />
                <Layer
                  id={`${layer.name}-layer`}
                  type="raster"
                  source={`${layer.name}-source`}
                  paint={{}}
                  style={{ cursor: "pointer" }}
                  className="custom-cursor"
                />
              </div>
            ) : null
          )}
        </>
      )}
      <div style={{ position: "fixed", top: "8.5%", right: "0.5%" }}>
        <li className="tg-list-item">
          <h4>Enable Filters</h4>

          <input
            id="cb4"
            className="tgl tgl-flat"
            type="checkbox"
            onClick={handleToggleFilter}
          />
          <label className="tgl-btn" htmlFor="cb4"></label>
        </li>
      </div>
      
      {popupInfo &&
        (newactivelayer == "flood_data" ? (
          <Popup
            longitude={latlng["lngLat"].lng}
            latitude={latlng["lngLat"].lat}
            style={{ cursor: "pointer" }}
            onClose={() => setPopupInfo(null)}
            maxWidth="450px"
          >
            <div
              className="popup-upperlayer"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ width: "80%", marginLeft: "1vmax" }}>
                <Text fz="md">{popupInfo?.features[0].properties.name}</Text>
              </div>
              {/* <div style={{ width: "10%", }}>feature</div> */}
              <div style={{ width: "10%" }}>
                {/* <Group position="center">
                <CloseButton title="Close popover" size="xl" iconSize={20} onClick={} />
              </Group> */}
              </div>
            </div>

            <div
              className="popup-box"
              style={{
                width: "430px",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            >
              {/* middlelayer start*/}
              <div
                className="middle-layer"
                style={{
                  width: "100%",
                  height: "4vmax",
                  backgroundColor: "#405595",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text fz="xl" style={{ color: "white", fontSize: "24px" }}>
                  {popupInfo?.features[0].properties.outflow_time}
                </Text>
              </div>

              {/* endlayer start*/}
              <div
                className="last-layer"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  backgroundColor: "white",
                }}
              >
                {/* triangle */}
                <div style={{ position: "absolute", top: "-10px" }}>
                  <svg
                    style="color: white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    fill="currentColor"
                    class="bi bi-triangle-fill"
                    viewBox="0 0 16 16"
                  >
                    {" "}
                    <path
                      fill-rule="evenodd"
                      d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
                      fill="white"
                    ></path>{" "}
                  </svg>
                </div>

                <div
                  className="flow-container"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {/* Left section start */}
                  <div style={{ width: "50%", minHeight: "13vmax" }}>
                    {popupInfo?.features[0].properties.inflow_discharge ? (
                      <div style={{ marginTop: "1vmax", fontSize: "14px" }}>
                        <Center>
                          <Text fz="sm">INFLOW</Text>
                        </Center>
                      </div>
                    ) : (
                      ""
                    )}

                    <div style={{ marginTop: "1vmax", fontSize: "18px" }}>
                      <Center>
                        <Text fz="xl">
                          {popupInfo?.features[0].properties.inflow_discharge}
                        </Text>
                      </Center>
                    </div>
                    <div style={{ marginTop: "1vmax", fontSize: "18px" }}>
                      <Center>{""}</Center>
                    </div>
                  </div>

                  {/* Right section start */}
                  <div
                    style={{
                      width: "50%",
                      backgroundColor: "white",
                      height: "13vmax",
                    }}
                  >
                    {popupInfo?.features[0].properties.outflow_discharge ? (
                      <div style={{ marginTop: "1vmax", fontSize: "14px" }}>
                        <Center>
                          <Text fz="sm">OUTFLOW</Text>
                        </Center>
                      </div>
                    ) : (
                      ""
                    )}

                    <div style={{ marginTop: "1vmax", fontSize: "18px" }}>
                      <Center>
                        <Text fz="xl">
                          {popupInfo?.features[0].properties.outflow_discharge}
                        </Text>
                      </Center>
                    </div>

                    <div style={{ marginTop: "1vmax", fontSize: "18px" }}>
                      {popupInfo?.features[0].properties.outflow_discharge &&
                      popupInfo?.features[0].properties.outflow_trend_icon ==
                        "up" &&
                      popupInfo?.features[0].properties.status == "NORMAL" ? (
                        <div>
                          <Center>
                            {/* up */}
                            <svg
                              style="color: green"
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              fill="green"
                              class="bi bi-arrow-up"
                              viewBox="0 0 16 16"
                            >
                              {" "}
                              <path
                                fill-rule="evenodd"
                                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                              />{" "}
                            </svg>
                          </Center>
                        </div>
                      ) : popupInfo?.features[0].properties.outflow_discharge &&
                        popupInfo?.features[0].properties.outflow_trend_icon ==
                          "flat" &&
                        popupInfo?.features[0].properties.status == "NORMAL" ? (
                        <div>
                          <Center>
                            {/* flat-right */}
                            <svg
                              style="color: green"
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              fill="currentColor"
                              class="bi bi-arrow-right"
                              viewBox="0 0 16 16"
                            >
                              {" "}
                              <path
                                fill-rule="evenodd"
                                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                              />{" "}
                            </svg>
                          </Center>
                        </div>
                      ) : popupInfo?.features[0].properties.outflow_discharge &&
                        popupInfo?.features[0].properties.outflow_trend_icon ==
                          "down" &&
                        popupInfo?.features[0].properties.status == "NORMAL" ? (
                        <div>
                          <Center>
                            {/* down-right */}
                            <svg
                              style="color: green"
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              fill="currentColor"
                              class="bi bi-arrow-down"
                              viewBox="0 0 16 16"
                            >
                              {" "}
                              <path
                                fill-rule="evenodd"
                                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                              />{" "}
                            </svg>
                          </Center>
                        </div>
                      ) : (
                        ""
                      )}

                      <div>
                        <Center>
                          {popupInfo?.features[0].properties
                            .outflow_discharge &&
                          popupInfo?.features[0].properties.status ==
                            "NORMAL" ? (
                            <Text style={{ color: "green" }}>
                              {popupInfo?.features[0].properties.status}
                            </Text>
                          ) : (
                            ""
                          )}
                        </Center>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        ) : (
          popupInfo && (
            <Popup
              longitude={latlng["lngLat"].lng}
              latitude={latlng["lngLat"].lat}
              style={{ cursor: "pointer" }}
              onClose={() => setPopupInfo(null)}
              maxWidth="450px"
            >
              <h4 style={{ fontWeight: "bold" }}>Raw Data</h4>
              {Object.entries(popupInfo?.features?.[0]?.properties || {}).map(
                ([key, value]) => (
                  <div key={key} style={{ border: " 1px solid #ccc" }}>
                    <table
                      className="popup-table"
                      style={{
                        borderCollapse: "collapse",
                        textAlign: "left",
                        border: " 1px solid #ccc",
                        width: "100%",
                      }}
                    >
                      <tr className="popup-tr">
                        <td
                          style={{
                            padding: "5px",
                            fontSize: "13px",
                            border: " 1px solid #ccc",
                            width: "150px",
                          }}
                        >
                          {key}:
                        </td>
                        <td
                          style={{
                            padding: "5px",
                            fontSize: "13px",
                            border: " 1px solid #ccc",
                            width: "150px",
                          }}
                        >
                          {value}
                        </td>{" "}
                      </tr>
                    </table>
                  </div>
                )
              )}
            </Popup>
          )
        ))}
    </>
  );
}
