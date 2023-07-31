import { signal } from "@preact/signals";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef, useState, useCallback } from "preact/compat";
import { Map, ScaleControl, Source, Layer, Marker } from "react-map-gl";
import useAuth from "../../../hooks/useAuth";
import Controls from "./Controls";
import { useNavigate } from "react-router-dom";
import { isFloodSimulationLayerChecked } from "./OverlayControl";
import { FaPlay, FaStop, FaPause } from "react-icons/fa";
import { toast } from "react-toastify";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import sutlejRiverJson from "./sutlejRiver.json";

export const mapStyle = signal(
  "https://api.maptiler.com/maps/outdoor/style.json?key=Fbb9bsvj7tIEC7vzB2TD"
);

export default () => {

  let [polygonCoordinatesArr, setPolygonCoordinatesArr] = useState([]);
  let [skyWatchStatusArr, setSkyWatchStatusArr] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [terrainEnabled, setTerrainEnabled] = useState(false);
  const [showWindyContainer, toggleWindy] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 30.142810171815725,
    longitude: 70.79877300178558,
    zoom: 5.1,
  });
  const [player, showPlayer] = useState(false);
  const [markerLat, setMarkerLat] = useState(30.738617753659838);
  const [markerLng, setMarkerLng] = useState(70.82973251729541);
  const [showMarker, setShowMarker] = useState(false);
  const [selectedRivers, setSelectedRivers] = useState([]);
  const [showRiversDropdown, setShowRiversDropdown] = useState(false);
  const riverNames = ["Jhelum", "Chenab", "Ravi", "Sutlej", "Indus"];
  const tempLineString = 0;
  const tempCoordinate = 0;

  function performGetRequest(id, featuresObj) {
    if (!id) {
      console.error("Pipeline ID is missing");
      return;
    }

    const getURL = `https://api.skywatch.co/earthcache/pipelines/${id}/interval_results`;
    const apiKey = "0c8806ca-4796-4fca-b6fb-c7e1ef9db782";

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    };

    makeRequest(id, getURL, requestOptions, apiKey, featuresObj);
  }

  function makeRequest(id, getURL, requestOptions, apiKey, featuresObj) {
    fetch(getURL, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length == 0) {
          makeRequest(id, getURL, requestOptions, apiKey, featuresObj);
          return;
        }

        let dataObj = res.data[0];
        console.log("data from response is=======>", dataObj)
        const myTestArray = dataObj.results;
        let myImage = "";
        myTestArray.forEach((result) => {
          console.log("data from Image_preview_url is=======>", result.preview_url);
          myImage = result.preview_url
        });
        setTableData({
          id: dataObj.output_id,
          image: myImage,
          interval: dataObj.interval.start_date
          // Add other properties from dataObj here
        });

        if (dataObj.status !== "complete") {
          let skyWatchArr = {
            isShow: true,
            status: "Pending",
            coordinateArr:
              featuresObj[Object.keys(featuresObj)[0]].geometry.coordinates,
          };

          if (
            !skyWatchStatusArr.some(
              (x) => x.coordinateArr == skyWatchArr.coordinateArr
            )
          ) {
            skyWatchStatusArr = skyWatchStatusArr.concat(skyWatchArr);
            setSkyWatchStatusArr(skyWatchStatusArr);
          }

          setTimeout(() => {
            makeRequest(id, getURL, requestOptions, apiKey, featuresObj);
          }, 8000);
        } else {
          skyWatchStatusArr = skyWatchStatusArr.filter(
            (x) =>
              x.coordinateArr !=
              featuresObj[Object.keys(featuresObj)[0]].geometry.coordinates
          );
          setSkyWatchStatusArr(skyWatchStatusArr);

          if (dataObj.results.length == 0) {
            toast.error("No Image From Satellite");
            return;
          }

          let obj = {
            coordinates:
              featuresObj[Object.keys(featuresObj)[0]].geometry.coordinates,
            imgUrl: dataObj.results[0].preview_url,
          };

          let arr = polygonCoordinatesArr.concat(obj);
          setPolygonCoordinatesArr(arr);
        }
      })
      .catch((error) => {
        console.error("GET Error:", error);
        setTimeout(() => {
          makeRequest(id, getURL, requestOptions, apiKey, featuresObj);
        }, 8000);
      });
  }

  useEffect(() => {
    maplibreGl.accessToken =
      "pk.eyJ1IjoiZGFqbWEwMCIsImEiOiJjbGo3NThla20wdDVoM3BueHU4cWQwY2R2In0.Ajx0B2drdxtMpRXGSb2D_Q";
  }, []);

  const handleToggleTerrain = () => {
    setTerrainEnabled(!terrainEnabled);
  };

  const showWindy = () => {
    navigate("/Windy");
  };

  // if the flood simulation layer is checked then its value is true, otherwise false
  // based on that we are determining whether to show rivers dropdown
  useEffect(() => {
    setShowRiversDropdown(isFloodSimulationLayerChecked.value);
  }, [isFloodSimulationLayerChecked.value]);

  const handleRiverChange = (event) => {
    const value = event.target.value;
    // On autofill we get a stringified value.
    setSelectedRivers(typeof value === "string" ? value.split(",") : value);
  };

  // SELECTED RIVER 
  useEffect(() => {
    if (selectedRivers.length > 0) {
      if (selectedRivers.some((riverName) => riverName == "Sutlej")) {
        setShowMarker(true);
        animateMarker();
        showPlayer(true);
      }
    } else {
      showPlayer(false);
      setShowMarker(false);
    }
  }, [selectedRivers]);

  const animateMarker = () => {
    const lineStrings = [];
    sutlejRiverJson.features.forEach((lineString) => {
      const currentLineString = {
        id: lineString.id,
        seconds: lineString.properties.seconds,
        coordinates: lineString.geometry.coordinates,
      };
      lineStrings.push(currentLineString);
    });
    // console.log(lineStrings);
    const simulateAnimation = async () => {
      for (const [lineIndex, lineString] of lineStrings.entries()) {
        const timePerInterval = Math.ceil(
          (lineString.seconds * 1000) / lineString.coordinates.length
        );
        // since setTtimeout is asynchronus, we need await a promise
        for (const [
          coordinateIndex,
          coordinate,
        ] of lineString.coordinates.entries()) {
          // prettier-ignore
          if (lineIndex < tempLineString) {
            // console.log("skipping line string: ",lineIndex," and coordinate: ",coordinateIndex);
            continue;
          }
          else if (lineIndex == tempLineString && coordinateIndex < tempCoordinate) {
            // console.log("skipping line string: ",lineIndex," and coordinate: ",coordinateIndex);
            continue;
          }
          await new Promise((resolve) => setTimeout(resolve, timePerInterval));
          setMarkerLat(coordinate[1]);
          setMarkerLng(coordinate[0]);
        }
      }
    };
    simulateAnimation();
  };

  const togglePlayPause = () => { };
  const toggleStop = () => {
    setShowMarker(!showMarker);
  };

  return (
    <div className="w-full h-screen">
      {player && (
        <div
          style={{
            position: "absolute",
            zIndex: 40,
            right: 4,
            top: "15%",
            background: "linear-gradient(45deg, #787878 0%, #a8ee90 100%)",
          }}
          className="p-2 rounded-md shadow-md flex"
        >
          <button
            onClick={togglePlayPause}
            className="bg-white"
            style={{
              borderRadius: "100%",
              height: "2.2rem",
              width: "1rem",
            }}
          >
            {true ? (
              <FaPause style={{ marginLeft: "-0.4rem" }} className="text-sm" />
            ) : (
              <FaPlay style={{ marginLeft: "-0.4rem" }} className="text-sm" />
            )}
          </button>
          <button
            onClick={toggleStop}
            className="bg-white"
            style={{
              borderRadius: "100%",
              height: "2.2rem",
              width: "1rem",
              marginLeft: "0.5rem",
            }}
          >
            <FaStop
              style={{
                marginLeft: "-0.4rem",
                color: showMarker ? "red" : "black",
              }}
              className="text-sm"
            />
          </button>
        </div>
      )}

      {showRiversDropdown && (
        <FormControl
          sx={{ m: 1, width: 150 }}
          size="small"
          style={{
            position: "absolute",
            zIndex: 40,
            top: "25%",
            background: "white",
          }}
        >
          <InputLabel id="select-rivers-checkbox-label">Rivers</InputLabel>
          <Select
            labelId="select-rivers-checkbox-label"
            id="select-rivers"
            multiple
            value={selectedRivers}
            onChange={handleRiverChange}
            input={<OutlinedInput label="Select River" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {riverNames.map((riverName) => (
              <MenuItem key={riverName} value={riverName}>
                <Checkbox
                  size="small"
                  color="success"
                  checked={selectedRivers.indexOf(riverName) > -1}
                />
                <ListItemText primary={riverName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {!showWindyContainer ? (
        <Map
          ref={mapRef}
          attributionControl={false}
          mapLib={maplibreGl}
          mapStyle={mapStyle.value}
          terrain={
            terrainEnabled
              ? { source: "terrain3d", exaggeration: 4.5 }
              : undefined
          }
          cursor="pointer"
          trackResize={true}
          flex={3}
          style={{ width: "100%", height: "100%" }}
          initialViewState={viewport}
        >
          {polygonCoordinatesArr.length > 0 &&
            polygonCoordinatesArr.map((item, index) => (
              <Source
                id="image"
                type="image"
                url={item.imgUrl}
                coordinates={item.coordinates[0]}
              >
                <Layer id="image-layer" type="raster" paint={{}} />
              </Source>
            ))}

          {skyWatchStatusArr.length > 0 &&
            skyWatchStatusArr.map((item, index) => (
              <Marker
                latitude={item.coordinateArr[0][0][1]}
                longitude={item.coordinateArr[0][0][0]}
                offsetTop={-20}
                offsetLeft={-10}
              >
                <div
                  style={{
                    padding: "0.3rem",
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                    boxShadow: "0 1px 3px #ccc",
                    fontWeight: "600",
                  }}
                >
                  Fetching Image...
                </div>
              </Marker>
            ))}

          {terrainEnabled && (
            <Source
              id="terrain3d"
              type="raster-dem"
              url="https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=Fbb9bsvj7tIEC7vzB2TD"
            />
          )}
          {/* Other map components */}
          <ScaleControl position="bottom-right" maxWidth={200} unit="metric" />

          {showRiversDropdown && showMarker && (
            <Marker
              latitude={markerLat}
              longitude={markerLng}
              offsetTop={-20}
              offsetLeft={-10}
            // instead of sudden movement of marker
            // to smoothly animate it, uncomment below styling
            // style={{
            //   transition: "transform 0.5s ease",
            // }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "red",
                }}
              />
            </Marker>
          )}

          <Controls showWindy={showWindy} />
        </Map>
      ) : (
        <div style={{ width: "100vw", height: "100%", position: "absolute" }}>
          <iframe
            src={"/windy.html"}
            style={{ width: "100vw", height: "100vh", marginTop: "0" }}
          ></iframe>
        </div>
      )}
    </div>
  );
};
