import { signal } from "@preact/signals";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef, useState, useCallback } from "preact/compat";
import { Map, ScaleControl, Source, Layer, Marker } from "react-map-gl";
import useAuth from "../../../hooks/useAuth";
import Controls from "../Map/Controls";
import { useNavigate } from "react-router-dom";
import { isFloodSimulationLayerChecked } from "../Map/OverlayControl";
import { FaPlay, FaStop, FaPause } from "react-icons/fa";
import DrawControl from "../Map/DrawControl";
import { toast } from "react-toastify";
import ControlPanel from "../Map/ControlPanel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import sutlejRiverJson from "../Map/sutlejRiver.json";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';



export const mapStyle = signal(
  "https://api.maptiler.com/maps/outdoor/style.json?key=Fbb9bsvj7tIEC7vzB2TD"
);

export default () => {
  const [pipelineId, setPipelineId] = useState(null);

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

  // DATE FUNCTIONALITY
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [formattedStartDate, setFormattedStartDate] = React.useState('');
  const [formattedEndDate, setFormattedEndDate] = React.useState('');
  const formattedStartDateRef = useRef('');
  const formattedEndDateRef = useRef('');
  const lowResolutionRef = useRef('');
  const highResolutionRef = useRef('');

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };

  useEffect(() => {
    const formattedStartDate1 = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
    setFormattedStartDate(formattedStartDate1)
    formattedStartDateRef.current = formattedStartDate1;
  }, [startDate]);

  useEffect(() => {
    const formattedEndDate1 = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';
    setFormattedEndDate(formattedEndDate1);
    formattedEndDateRef.current = formattedEndDate1;
  }, [endDate]);

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };
  // END DATE FUNCTIONALITY

  const [polygonCoordinates, setPolygonCoordinates] = useState({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
  });
  const [features, setFeatures] = useState({});
  const [player, showPlayer] = useState(false);
  const [markerLat, setMarkerLat] = useState(30.738617753659838);
  const [markerLng, setMarkerLng] = useState(70.82973251729541);
  const [showMarker, setShowMarker] = useState(false);
  const [selectedRivers, setSelectedRivers] = useState([]);
  const [showRiversDropdown, setShowRiversDropdown] = useState(false);
  const [lowResolution, setLowResolution] = useState(30);
  const [highResolution, setHighResolution] = useState(10);
  const [skyWatch, setSkyWatch] = useState(true);
  const [submitButoon, setSubmitButoon] = useState(false);
  const riverNames = ["Jhelum", "Chenab", "Ravi", "Sutlej", "Indus"];
  const tempLineString = 0;
  const tempCoordinate = 0;

  const handleCreatePolygon = useCallback((e) => {
    const newFeatures = { ...features };
    for (const f of e.features) {
      newFeatures[f.id] = f;
    }
    setFeatures(newFeatures);
    setSubmitButoon(true);
  }, [features]);

  // Handle submitting the request
  const handleSubmitRequest = useCallback(() => {
    skyWatchPost(features);
  }, [features]);

  // HANDLE RESOLUTION
  const handleLowResolutionChange = (e) => {
    setLowResolution(e.target.value);
    console.log("resolution is", lowResolution)
    lowResolutionRef.current = lowResolution;
  }
  const handleHighResolutionChange = (e) => {
    setHighResolution(e.target.value);
    console.log("resolution is", highResolution)
    highResolutionRef.current = highResolution;
  }

  useEffect(() => {
    if (startDate) {
      console.log(startDate.toISOString().substring(0, 10));
    }
  }, [startDate])

  useEffect(() => {
    if (endDate) {
      console.log(endDate.toISOString().substring(0, 10));
    }
  }, [endDate])

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      setSubmitButoon(false);
      return newFeatures;
    });
  }, []);

  const handleMapRightClick = (event) => {
    const { lngLat } = event;
    const clickedPoint = [lngLat.lng, lngLat.lat];

    // Update the polygon coordinates state with the clicked point
    setPolygonCoordinates((prevCoordinates) => {
      const updatedCoordinates = [
        ...prevCoordinates.geometry.coordinates,
        clickedPoint,
      ];

      return {
        ...prevCoordinates,
        geometry: {
          ...prevCoordinates.geometry,
          coordinates: [updatedCoordinates], // Wrap the updated coordinates in an array
        },
      };
    });
  };

  const handleMapMouseMove = (event) => {
    if (polygonCoordinates.geometry.coordinates.length === 0) {
      return;
    }

    const { lngLat } = event;
    const currentPoint = [lngLat.lng, lngLat.lat];

    // Update the polygon coordinates state with the current point as the last coordinate
    setPolygonCoordinates((prevCoordinates) => {
      const updatedCoordinates = [
        ...prevCoordinates.geometry.coordinates,
        currentPoint,
      ];

      return {
        ...prevCoordinates,
        geometry: {
          ...prevCoordinates.geometry,
          coordinates: [updatedCoordinates], // Wrap the updated coordinates in an array
        },
      };
    });
  };



  const skyWatchPost = (featuresObj) => {
    // console.log(featuresObj);
    const url = "https://api.skywatch.co/earthcache/pipelines";
    // const url = "https://www.google.com";
    const apiKey = "0c8806ca-4796-4fca-b6fb-c7e1ef9db782";

    const startDate1 = new Date(formattedStartDateRef.current);
    const endDate1 = new Date(formattedEndDateRef.current);
    const differenceInMilliseconds = endDate1 - startDate1;

    // Convert the difference to days
    const differenceInDays = String(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    const requestData = {
      name: "Example Low Resolution Islamabad",
      interval: `${differenceInDays}d`,
      start_date: formattedStartDateRef.current,
      output: {
        id: "a8fc3dde-a3e8-11e7-9793-ae4260ee3b4b",
        format: "geotiff",
        mosaic: "off",
      },
      end_date: formattedEndDateRef.current,
      aoi: {
        type: "Polygon",
        coordinates:
          featuresObj[Object.keys(featuresObj)[0]].geometry.coordinates,
      },
      max_cost: 0,
      min_aoi_coverage_percentage: 80,
      result_delivery: {
        max_latency: "0d",
        priorities: ["latest", "highest_resolution", "lowest_cost"],
      },
      resolution_low: lowResolutionRef.current,
      resolution_high: highResolutionRef.current,
      // resolution: formattedResolution.current,
      tags: [
        { label: "Islamabad", value: "Pakistan" },
        { label: "Resolution", value: "10m" },
      ],
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(requestData),
    };
    debugger;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          toast.error(data.errors[0].message);
        }
        // console.log(data);
        // console.log(data.data.id);

        const id = data.data.id;
        setPipelineId(id);

        // Process the response data
        // console.log("Pipeline Created!");
        // console.log("Your Pipeline ID is: " + id);
        // console.log("Status: " + data.data.status);

        // Call the function to perform the GET request in a loop
        performGetRequest(id, featuresObj); // Start the GET request loop
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleMapClick = (event) => {
    // console.log(event);
    const { lngLat, originalEvent } = event;
    if (originalEvent.button === 2) {
      // Right-click event
      const clickedPoint = {
        lng: lngLat[0],
        lat: lngLat[1],
      };

      // Create a polygon around the clicked point
      const halfKm = 0.5 * 1000;
      const extents = [
        [
          clickedPoint.lng - halfKm / 111111,
          clickedPoint.lat -
          halfKm / (111111 * Math.cos(clickedPoint.lat * (Math.PI / 180))),
        ],
        [
          clickedPoint.lng + halfKm / 111111,
          clickedPoint.lat -
          halfKm / (111111 * Math.cos(clickedPoint.lat * (Math.PI / 180))),
        ],
        [
          clickedPoint.lng + halfKm / 111111,
          clickedPoint.lat +
          halfKm / (111111 * Math.cos(clickedPoint.lat * (Math.PI / 180))),
        ],
        [
          clickedPoint.lng - halfKm / 111111,
          clickedPoint.lat +
          halfKm / (111111 * Math.cos(clickedPoint.lat * (Math.PI / 180))),
        ],
        [
          clickedPoint.lng - halfKm / 111111,
          clickedPoint.lat -
          halfKm / (111111 * Math.cos(clickedPoint.lat * (Math.PI / 180))),
        ],
      ];

      const latLngs = extents.map((coord) => [coord[1], coord[0]]);

      // Perform Skywatch API request with the created polygon coordinates
      // const url = "https://www.google.com";
      const url = "https://api.skywatch.co/earthcache/pipelines";
      const apiKey = "0c8806ca-4796-4fca-b6fb-c7e1ef9db782";

      const requestData = {
        name: "Example Low Resolution Islamabad",
        interval: `${differenceInDays}d`,
        start_date: formattedStartDateRef.current,
        output: {
          id: "a8fc3dde-a3e8-11e7-9793-ae4260ee3b4b",
          format: "geotiff",
          mosaic: "off",
        },
        end_date: formattedEndDateRef.current,
        aoi: {
          type: "Polygon",
          coordinates: [latLngs],
        },
        max_cost: 0,
        min_aoi_coverage_percentage: 80,
        result_delivery: {
          max_latency: "0d",
          priorities: ["latest", "highest_resolution", "lowest_cost"],
        },
        resolution_low: lowResolutionRef.current,
        resolution_high: highResolutionRef.current,
        // resolution: formattedResolution.current,
        tags: [
          { label: "Islamabad", value: "Pakistan" },
          { label: "Resolution", value: "10m" },
        ],
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(requestData),
      };

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          // console.log(data.data.id);

          const id = data.data.id;
          setPipelineId(id);

          // Process the response data
          // console.log("Pipeline Created!");
          // console.log("Your Pipeline ID is: " + id);
          // console.log("Status: " + data.data.status);

          // Call the function to perform the GET request in a loop
          performGetRequest(id); // Start the GET request loop
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

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
        let lowResoloutionArr = 0;
        let highResoloutionArr = 0;
        let cloudPercentage = 0;
        myTestArray.forEach((result) => {
          console.log("data from Image_preview_url is=======>", result.preview_url);
          myImage = result.preview_url
          lowResoloutionArr = result.metadata.resolution_x
          highResoloutionArr = result.metadata.resolution_y
          cloudPercentage = result.metadata.cloud_cover_percentage
        });
        
        setTableData({
          id: dataObj.output_id,
          image: myImage,
          startDate: dataObj.interval.start_date,
          endDate: dataObj.interval.end_date,
          status: dataObj.status,
          intervalCost: dataObj.total_interval_cost,
          lowResolution: lowResoloutionArr,
          highResolution: highResoloutionArr,
          cloudCover:cloudPercentage,
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
          // console.log("finalizedImage");
          // console.log(dataObj.results);
          setIsPopupOpen(true);
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

  const handleSkyWatch = () => {
    console.log("skywatc", skyWatch)
    if (skyWatch == true) {
      setSkyWatch(false)
    }
    else {
      setSkyWatch(true)
    }
  }

  // POPUP 
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const [tableData, setTableData] = useState({
  });


  const handleSubmit = useCallback(async () => {
    try {
      debugger;
      // Assuming you have the real data available in your front-end state or variables.
      const realDataObj = {
        output_id: "12345",
        interval: {
          start_date: "2023-07-26",
          end_date: "2023-07-28",
        },
        status: "Completed",
        total_interval_cost: 500,
        lowResoloutionArr: [1024, 768],
        highResoloutionArr: [4096, 2160],
        cloudPercentage: 10,
        // Add other properties from dataObj here with their real values.
      };
  
      // Create the JSON object with the actual data
      const requestData = {
        id: tableData.id,
        image: tableData.image, // Replace "myImage" with the actual image URL or data.
        startDate: tableData.startDate,
        endDate: tableData.endDate,
        status: tableData.status,
        intervalCost:tableData.intervalCost,
        lowResolution: tableData.lowResolution,
        highResolution: tableData.highResolution,
        cloudCover: tableData.cloudCover,
        // Add other properties from dataObj here with their real values.
      };
  
      const response = await fetch("https://localhost:7013/api/SkyWatch/AddResponseData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        // Handle non-200 response, if needed.
        throw new Error("Request failed with status " + response.status);
      }
  
      // Assuming the response is JSON data, you can parse it as follows:
      const responseData = await response.json();
      console.log("datadskjfalsdjflk",responseData)
      toast.success(responseData.message);

      // Do something with the responseData if needed.
  
    } catch (error) {
      // Handle any errors that occurred during the request.
      console.error("Error sending request:", error);
      toast.error("Failed to Enter Data into Database");
    }
  }, [tableData]);

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
      {skyWatch && (
        <div
          style={{
            position: "absolute",
            top: "300px",
            left: "2px",
            background: "white",
            width: "150px",
            borderRadius: "0",
            zIndex: "4"
          }}
        >
          <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Resolution</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={lowResolution}
              onChange={handleLowResolutionChange}
              label="Resolution"
            >
              <MenuItem value={10}>Low Resolution</MenuItem>
              <MenuItem value={30}>High Resolution</MenuItem>
            </Select>
          </FormControl>
        </div>
      )
      }
      {skyWatch && (
        <div
          style={{
            position: "absolute",
            top: "300px",
            left: "155px",
            background: "white",
            width: "150px",
            borderRadius: "0",
            zIndex: "4"
          }}
        >
          <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Resolution</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={highResolution}
              onChange={handleHighResolutionChange}
              label="Resolution"
            >
              <MenuItem value={10}>Low Resolution</MenuItem>
              <MenuItem value={30}>High Resolution</MenuItem>
            </Select>
          </FormControl>
        </div>
      )
      }
      {submitButoon && (
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "2px",
            width: "300px",
            borderRadius: "0",
            zIndex: "5"
          }}
        >
          <button onClick={handleSubmitRequest}>Submit</button>
        </div>

      )}
      {
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "2px",
            width: "300px",
            borderRadius: "0",
            zIndex: "5"
          }}
        >
          <button onClick={handleSkyWatch}>SkyWatch</button>
        </div>
      }

      {skyWatch && (
        <div
          style={{
            position: "absolute",
            top: "370px",
            left: "2px",
            width: "300px",
            borderRadius: "0",
            zIndex: "5"
          }}
        >

          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DemoContainer components={['DatePicker']}>
              <InputLabel htmlFor="start-date-picker">Start Date</InputLabel>
              <div style={{ background: "white", width: "150px" }}>
                <DatePicker
                  id="start-date-picker"
                  value={startDate}
                  onChange={handleChangeStartDate}
                />
              </div>
            </DemoContainer>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <InputLabel htmlFor="end-date-picker">End Date</InputLabel>
              <div style={{ background: "white", width: "150px" }}>
                <DatePicker
                  id="end-date-picker"
                  value={endDate}
                  onChange={handleChangeEndDate}
                />
              </div>
            </DemoContainer>
          </LocalizationProvider>

        </div>
      )}
      {
        <div style={{
          position: "absolute",
          bottom: "0px",
          left: "2px",
          width: "300px",
          borderRadius: "0",
          zIndex: "5"
        }}>

          <Button variant="contained" color="primary" onClick={handleOpenPopup}>
            Open Popup
          </Button>
          <Dialog open={isPopupOpen} onClose={handleClosePopup}>
            <DialogTitle>Popup Title</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Total Interval Cost</TableCell>
                      <TableCell>Resolution Low</TableCell>
                      <TableCell>Resolution High</TableCell>
                      <TableCell>Cloud Cover Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{tableData.id}</TableCell>
                      <TableCell>{tableData.image}</TableCell>
                      <TableCell>{tableData.startDate}</TableCell>
                      <TableCell>{tableData.endDate}</TableCell>
                      <TableCell>{tableData.status}</TableCell>
                      <TableCell>{tableData.intervalCost}</TableCell>
                      <TableCell>{tableData.lowResolution}</TableCell>
                      <TableCell>{tableData.highResolution}</TableCell>
                      <TableCell>{tableData.cloudCover}</TableCell>
                      {/* Add more table cells for other fields */}
                    </TableRow>
                    <div style={{
                      display: "flex",
                      justifyContent: "center"
                    }}>
                      <button style={{ marginRight: "10px" }}>Display</button>
                      <button onClick={handleSubmit}>Submit</button>
                    </div>
                  </TableBody>
                </Table>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      }

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
          onClick={handleMapClick}
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

          {skyWatch && (
            <DrawControl
              position="top-left"
              style={{ top: "24rem" }}
              displayControlsDefault={false}
              controls={{
                polygon: true,
                trash: true,
              }}
              defaultMode="draw_polygon"
              onCreate={handleCreatePolygon}
              onDelete={onDelete}
            />
          )}

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

          {skyWatch &&
            (
              <ControlPanel polygons={Object.values(features)} />
            )
          }

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
