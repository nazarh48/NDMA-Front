import { Menu, Grid } from "@mantine/core";
import { IconMap } from "@tabler/icons";
import { TiWeatherSunny } from "react-icons/ti";
import { IconCloud, IconCloudRain, IconSunHigh, IconHaze } from "@tabler/icons";
import { Marker, Popup, Source, useMap } from "react-map-gl";
import { useEffect, useState } from "preact/hooks";
import { signal } from "@preact/signals-core";
import "../../../index.css";

export const _selectedWeather = signal(null);
const getWeatherIcon = (condition) => {
  switch (condition) {
    case "Clouds":
      return "cloudy";
    case "Clear":
      return "day";
    case "Rain":
      return "rainy";
    case "Snow":
      return "snowy";
    default:
      return "day";
  }
};

export default () => {
  const [zoom, setZoom] = useState(0);
  const [upcountryLatLng, setUpcountryLatLng] = useState([]);
  const [weatherParam, setWeatherParam] = useState(false);
  const [precipitationParam, setPrecipitationParam] = useState(false);
  const [tempratureParam, setTempratutreParam] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherPMDParam, setWeatherPMDParam] = useState(false);

  const map = useMap().current;

  const CountryLatLng = [
    {
      lat: 26.0081,
      lng: 63.0383,
    },
    {
      lat: 27.8165,
      lng: 66.6057,
    },
    {
      lat: 24.999886,
      lng: 67.064827,
    },
    {
      lat: 30.679321,
      lng: 73.071983,
    },
    {
      lat: 24.877678,
      lng: 70.240829,
    },
    {
      lat: 26.05073,
      lng: 68.946892,
    },
    {
      lat: 32.9910,
      lng: 70.6455,
    },
    {
      lat: 26.046238,
      lng: 68.956398,
    },
    {
      lat: 31.146505,
      lng: 72.681084,
    },
    {
      lat: 29.645947,
      lng: 70.591934,
    },
    {
      lat: 32.51796,
      lng: 74.500916,
    },
    {
      lat: 30.674294,
      lng: 73.083008,
    },
    {
      lat: 33.601128,
      lng: 71.444778,
    },
    {
      lat: 31.558,
      lng: 74.35071,
    },
    {
      lat: 31.41554,
      lng: 73.08969,
    },
    {
      lat: 26.2447,
      lng: 68.3935,
    },
    {
      lat: 33.72148,
      lng: 73.04329,
    },
    {
      lat: 34.008,
      lng: 71.57849,
    },
    {
      lat: 30.18327,
      lng: 66.996452,
    },
  ];
  

  const apiKey = "e9c1614b9ce10fb3bac92e1726112334";
  const [precipitations, setPrecipitations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://ndma.ddns.net:8600/geoserver/PMD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PMD%3Asynop_currentdata&maxFeatures=100&outputFormat=application%2Fjson"
        );
        const data = await response.json();
        setWeatherData(data.features);
        console.log("geo json Data==>>", data.features);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (
      !weatherParam &&
      !precipitationParam &&
      !tempratureParam &&
      !weatherPMDParam
    ) {
      _selectedWeather.value = null;
    }
  }, [weatherParam, precipitationParam, tempratureParam, weatherPMDParam]);
  useEffect(() => {
    CountryLatLng.map((e) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${e.lat}&lon=${e.lng}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const newLatLng = {
            lat: e.lat,
            lng: e.lng,
            temp: Math.floor(data.main.temp),
            precipitation: data.rain?.["1h"] ?? 0,
            city: data.name,
            weather: data.weather[0].main,
          };
          setUpcountryLatLng((prevState) => [...prevState, newLatLng]);
          setPrecipitations((prevState) => [
            ...prevState,
            newLatLng.precipitation,
          ]);
        });
    });
  }, []);
  useEffect(() => {
    if (map) {
      setZoom(map.getZoom());
      map.on("zoom", () => setZoom(map.getZoom()));
    }
  }, [map]);
  let headingText;
  if (weatherParam === true) {
    headingText = "Weather";
    _selectedWeather.value = "weather";
  } else if (precipitationParam === true) {
    headingText = "Precipitation";
    _selectedWeather.value = "precipitation";
  } else if (tempratureParam === true) {
    headingText = "Temperature";
    _selectedWeather.value = "temperature";
  } else if (weatherPMDParam === true) {
    headingText = "Current Weather PMD";
    _selectedWeather.value = "Current Weather PMD";
  }
  return (
    <>
      {/* {headingText && <h1 className="layer-heading">{headingText}</h1>} */}
      <Menu position="left-end" withArrow>
        <Menu.Target>
          <div
            id="overlaycontrol"
            className="  hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer     z-70   p-3 rounded-full text-white bg-components shadow-lg"
          >
            <IconCloud size={30} />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              setWeatherPMDParam(!weatherPMDParam);
              setPrecipitationParam(false);
              setTempratutreParam(false);
              setWeatherParam(false);
            }}
          >
            Current Weather PMD
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setWeatherPMDParam(false);
              setWeatherParam(!weatherParam);
              setPrecipitationParam(false);
              setTempratutreParam(false);
            }}
          >
            Weather
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setPrecipitationParam(!precipitationParam);
              setWeatherParam(false);
              setWeatherPMDParam(false);
              setTempratutreParam(false);
            }}
          >
            Precipitation
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setTempratutreParam(!tempratureParam);
              setWeatherParam(false);
              setWeatherPMDParam(false);
              setPrecipitationParam(false);
            }}
          >
            Temperature
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {weatherPMDParam &&
        weatherData.map((location) => (
          <Marker
          style={{ display: zoom > 7 ? "block" : "none" }}
 
            key={location.id}
            longitude={location.geometry.coordinates[0]}
            latitude={location.geometry.coordinates[1]}
          >
            <div className="weather-data">
              <div
                className="weather-icon"
                style={{
                  backgroundColor:
                    location.properties.cloud_status === "Clear Sky"
                      ? "orange"
                      : "#87CEEB",
                }}
              >
                {location.properties.cloud_status === "Clear Sky" ? (
                  <IconSunHigh size={15} color="white" />
                ) : location.properties.cloud_status === "Partly Cloudy" ? (
                  <IconCloud size={15} color="white" />
                ) : (
                  <IconCloudRain size={15} color="white" />
                )}
              </div>
              <div className="weather-info">
                <div className="station-name">
                  {location.properties.station_name}
                </div>
                <div className="cloud-status">
                  {location.properties.cloud_status}
                </div>
                {/* <div className="accumulated-rain">
                  {location.properties.accumulated_rain}
                </div> */}
                {/* <div className="relative-humidity">Humidity:{location.properties.relative_humidity}</div> */}
              </div>
            </div>
          </Marker>
        ))}
      {tempratureParam &&
        upcountryLatLng.map((e) => {
          const fontSize = zoom > 8 ? "14px" : "12px";
          return (
            <Marker
              longitude={e.lng}
              latitude={e.lat}
              className="popup-weather"
              closeButton={false}
              style={{ display: zoom > 6 ? "block" : "none" }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "-10px",
                    backgroundColor:
                      e.weather === "Clouds" ? "#87CEEB" : "orange",
                    borderRadius: "50%",
                    padding: "5px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {e.weather === "Clear" ? (
                    <IconSunHigh size={15} color="white" />
                  ) : e.weather === "Clouds" ? (
                    <IconCloud size={15} color="white" />
                  ) : e.weather === "Rain" ? (
                    <IconCloudRain size={15} color="white" />
                  ) : e.weather === "Haze" ? (
                    <IconHaze size={15} color="white" />
                  ) : (
                    <IconCloudRain size={15} color="white" />
                  )}
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                    padding: "10px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    {e.temp}&deg;C
                  </div>
                  <div style={{ fontSize: "14px", color: "gray" }}>
                    {e.city}
                  </div>
                </div>
              </div>
            </Marker>
          );
        })}
      {precipitationParam &&
        upcountryLatLng.map((e) => {
          const fontSize = zoom > 8 ? "14px" : "12px";
          return (
            <Marker
              longitude={e.lng}
              latitude={e.lat}
              className="popup-weather"
              closeButton={false}
              style={{ display: zoom > 6 ? "block" : "none" }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "-10px",
                    backgroundColor:
                      e.weather === "Clouds" ? "#87CEEB" : "orange",
                    borderRadius: "50%",
                    padding: "5px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {e.weather === "Clear" ? (
                    <IconSunHigh size={15} color="white" />
                  ) : e.weather === "Clouds" ? (
                    <IconCloud size={15} color="white" />
                  ) : e.weather === "Haze" ? (
                    <IconHaze size={15} color="white" />
                  ) : e.weather === "Rain" ? (
                    <IconCloudRain size={15} color="white" />
                  ) : (
                    <IconSunHigh size={15} color="white" />
                  )}
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                    padding: "10px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    {e.temp}&deg;C
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "gray",
                      marginBottom: "5px",
                    }}
                  >
                    {e.city}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      display: precipitationParam === true ? "block" : "none",
                    }}
                  >
                    Rain: {e.precipitation}mm
                  </div>
                </div>
              </div>
            </Marker>
          );
        })}
      {weatherParam &&
        upcountryLatLng.map((e) => {
          const fontSize = zoom > 8 ? "14px" : "12px";
          return (
            <Marker
              longitude={e.lng}
              latitude={e.lat}
              className="popup-weather"
              closeButton={false}
              style={{ display: zoom > 6 ? "block" : "none" }}
            >
              <div
                style={{
                  display: weatherParam == true ? "flex" : "none",
                  alignItems: "center",
                  padding: "5px",
                  backgroundColor: "white",
                  borderRadius: "5px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                }}
              >
                {e.weather === "Clear" ? (
                  <IconSunHigh size={20} color="#f2b900" />
                ) : e.weather === "Clouds" ? (
                  <IconCloud size={20} color="#87CEEB" />
                ) : e.weather === "Rain" ? (
                  <IconCloudRain size={20} color="#87CEEB" />
                ) : e.weather === "Haze" ? (
                  <IconHaze size={20} color="green" />
                ) : (
                  <IconSunHigh size={20} color="#f2b900" />
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "10px",
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {e.temp}&deg;C
                  </div>
                  <div style={{ fontSize: "14px", color: "gray" }}>
                    {e.city}
                  </div>
                </div>
              </div>
            </Marker>
          );
        })}
    </>
  );
};
