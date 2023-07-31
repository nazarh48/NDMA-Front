import React, { useState, useEffect } from "react";
import { Menu } from "@mantine/core";
import { IconCloudQuestion } from "@tabler/icons-react";
import "../../../index.css";
import { Marker, Popup, Source, useMap } from "react-map-gl";

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

function ForecastedWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [showWeatherData, setShowWeatherData] = useState(false);
  const [cityWeatherDict, setCityWeatherDict] = useState(null);
  const [cityWeatherPMD, setCityWeatherPMD] = useState(null);
  const [showPMDWeatherData, setShowPMDWeatherData] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [rainData, setRainData] = useState({});

  const [cityName, setCityName] = useState(null);

  const API_KEY = "4cad02da962dedc0c4985511bfb63665";

  useEffect(() => {
    if(showRain){
    CountryLatLng.forEach((e) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${e.lat}&lon=${e.lng}&appid=${API_KEY}&units=metric`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const cityName = data.name; // Extract the city name from the response data
          const onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${e.lat}&lon=${e.lng}&appid=${API_KEY}&units=metric`;
          fetch(onecallUrl)
            .then((response) => response.json())
            .then((onecallData) => {
              const { daily } = onecallData;
              const totalRain = daily.reduce(
                (sum, day) => sum + (day.rain ? day.rain : 0),
                0
              );
              const locationKey = `${e.lat}-${e.lng}`;
              setRainData((prevRainData) => ({
                ...prevRainData,
                [locationKey]: { cityName, totalRain },
              }));
            })
            .catch((error) => {
              console.error("Error fetching onecall data:", error);
            });
        });
    });
  }
  }, [showRain]);

  useEffect(() => {
    const fetchData = async () => {
      if (showWeatherData) {
        const weatherDataPromises = CountryLatLng.map(async (location) => {
          const { lat, lng } = location;
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
          const weatherResponse = await fetch(weatherUrl);
          const weatherData = await weatherResponse.json();
          const onecallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
          const onecallResponse = await fetch(onecallUrl);
          const onecallData = await onecallResponse.json();
          const onecallDataWithRain = onecallData.daily.map((day) => ({
            ...day,
            rain: day.rain ? day.rain : 0, // Add rain property and set it to 0 if it doesn't exist
          }));

          return {
            city: weatherData.name,
            weather: {
              ...onecallData,
              daily: onecallDataWithRain,
            },
          };
        });

        const allWeatherData = await Promise.all(weatherDataPromises);
        setWeatherData(allWeatherData);
        const cityDictionary = allWeatherData.reduce((dict, item) => {
          dict[item.city] = item.weather;
          return dict;
        }, {});
        setCityWeatherDict(cityDictionary);
        setCityName(allWeatherData.map((item) => item.city));
      }
    };

    const fetchPMDData = async () => {
      try {
        const response = await fetch(
          "http://ndma.ddns.net:8600/geoserver/PMD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PMD%3Anwp_forecast_3_days&maxFeatures=2000&outputFormat=application%2Fjson"
        );
        const data = await response.json();
        console.log("PMD data", data);
        // Create a dictionary to store weather data
        const weatherDict = {};

        data.features.forEach((feature) => {
          const { station_name, forecast_time, temp_max, temp_min, rain } =
            feature.properties;

          // Check if the station_name exists in the dictionary
          if (!weatherDict[station_name]) {
            weatherDict[station_name] = [];
          }

          // Add the weather data to the dictionary
          weatherDict[station_name].push({
            forecast_time,
            temp_max,
            temp_min,
            rain,
          });
        });

        setCityWeatherPMD(weatherDict);
        setCityName(Object.keys(weatherDict));
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchPMDData();

    fetchData();
  }, [API_KEY, CountryLatLng, showWeatherData, showPMDWeatherData]);
  useEffect(() => {}, []);

  const handleShowPMDWeatherData = () => {
    setShowPMDWeatherData(!showPMDWeatherData);
    setShowWeatherData(false);
    setShowRain(false);
  };
  const handleShowWeatherData = () => {
    setShowPMDWeatherData(false);
    setShowWeatherData(!showWeatherData);
    setShowRain(false);
  };
  const handleShowRainData = () => {
    setShowPMDWeatherData(false);
    setShowWeatherData(false);
    setShowRain(!showRain);
  };
  let headingText;
  if (showPMDWeatherData === true) {
    headingText = "  Forecast Weather PMD";
  } else if (showWeatherData === true) {
    headingText = " Forecast Weather OpenWeather";
  } else if (showRain === true) {
    headingText = "Accumulated Rain OpenWeather 8 Days Forecast";
  }

  return (
    <>
      <Menu position="left-end" withArrow>
        <Menu.Target>
          <div
            className="right-2 hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer   z-70   p-3 rounded-full text-white bg-components shadow-lg"
            title="Weather"
          >
            <IconCloudQuestion size={30} />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={handleShowWeatherData}>
            Forecast Weather OpenWeather
          </Menu.Item>
          <Menu.Item onClick={handleShowPMDWeatherData}>
            Forecast Weather PMD
          </Menu.Item>
          <Menu.Item onClick={handleShowRainData}>
            Accumulated Rain OpenWeather 8 Days Forecast
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <h1 className="layer-heading" style={{display:showPMDWeatherData || showWeatherData || showRain===true?"block":"none"}}>{headingText}</h1>

      {showRain &&
        CountryLatLng.map((location, index) => {
          const locationKey = `${location.lat}-${location.lng}`;
          const locationData = rainData[locationKey];
          return (
            <Marker
              key={index}
              longitude={location.lng}
              latitude={location.lat}
            >
              <div className="marker-content">
                <p className="city-name">
                  {locationData?.cityName || "No Data"}
                </p>
                {locationData?.totalRain && (
                  <div className="rain-info">
                    Rain: {locationData.totalRain.toFixed(1)} mm
                  </div>
                )}
              </div>
            </Marker>
          );
        })}

      {showWeatherData &&
        cityWeatherDict &&
        cityName &&
        Object.keys(cityWeatherDict).length > 0 && (
          <div className="forecast-table-container">
            <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
              OpenWeather Forecast 8 Days
            </h2>
            <table className="forecast-table">
              <thead>
                <tr>
                  <th className="header-cell">City</th>
                  <th className="header-cell">Date</th>
                  <th className="header-cell">Max Temp</th>
                  <th className="header-cell">Min Temp</th>
                  <th className="header-cell">Weather</th>
                  <th className="header-cell">Rain OpenWeather</th>
                  <th className="header-cell">Rain PMD</th>
                </tr>
              </thead>
              <tbody>
                {cityName.map((city, cityIndex) => (
                  <React.Fragment key={cityIndex}>
                    {cityWeatherDict[city]?.daily
                      ?.slice(0, 8)
                      .map((day, index) => (
                        <tr key={index} className="data-row">
                          {index === 0 && (
                            <td
                              rowSpan={cityWeatherDict[city].daily.length}
                              className="city-cell"
                            >
                              {city}
                            </td>
                          )}
                          <td className="date-cell">
                            {new Date(day.dt * 1000).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="max-temp-cell">
                            {Math.floor(day.temp.max)}°C
                          </td>
                          <td className="min-temp-cell">
                            {Math.floor(day.temp.min)}°C
                          </td>
                          <td
                            className="weather-cell"
                            style={{
                              color:
                                day.weather[0].main === "Clouds"
                                  ? "blue"
                                  : day.weather[0].main === "Clear"
                                  ? "orange"
                                  : day.weather[0].main === "Rain"
                                  ? "red"
                                  : "",
                            }}
                          >
                            {day.weather[0].main}
                          </td>
                          <td
                            className="rain-cell"
                            style={{ color: day.rain > 5 ? "red" : "" }}
                          >
                            {day.rain > 0 ? day.rain : 0} mm
                          </td>
                          <td className="rain-cell">
                            {cityWeatherPMD[city]?.[index]?.rain > 0
                              ? cityWeatherPMD[city][index].rain.toFixed(2)
                              : 0}{" "}
                            mm
                          </td>
                        </tr>
                      ))}
                    <tr
                      style={{ borderTop: "1px solid black" }}
                      className="separator-row"
                    >
                      <td colSpan="5"></td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showPMDWeatherData && cityWeatherPMD && cityName && cityName[0] !== 'null' ? (
          <div className="forecast-table-container-pmd">
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
            PMD Forecast
          </h2>
          <table className="forecast-table">
            <thead>
              <tr>
                <th className="header-cell">City</th>
                <th className="header-cell">Date/Time</th>
                <th className="header-cell">Max Temp</th>
                <th className="header-cell">Min Temp</th>
                <th className="header-cell">Rainfall</th>
              </tr>
            </thead>
            <tbody>
              {cityName.map((city, cityIndex) => (
                <React.Fragment key={cityIndex}>
                  {cityWeatherPMD[city]?.map((day, index) => (
                    <tr key={index} className="data-row">
                      {index === 0 && (
                        <td
                          rowSpan={cityWeatherPMD[city].length}
                          className="city-cell"
                        >
                          {city}
                        </td>
                      )}
                      <td className="forecast-time-cell">
                        {new Date(day.forecast_time).toLocaleString("en-US", {
                          timeZone: "Asia/Karachi",
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                        <br />
                        {new Date(day.forecast_time).toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>
                      <td className="max-temp-cell">
                        {Math.floor(day.temp_max - 273)}°C
                      </td>
                      <td className="max-temp-cell">
                        {Math.floor(day.temp_min - 273)}°C
                      </td>
                      <td className="rain-cell">
                        {day.rain > 0 ? day.rain.toFixed(2) : 0} mm
                      </td>
                    </tr>
                  ))}
                  <tr
                    style={{ borderTop: "1px solid black" }}
                    className="separator-row"
                  >
                    <td colSpan="5"></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
) : showPMDWeatherData ? (
  <div className="error-message">
    No Data Updated from PMD
  </div>
) : null}

    </>
  );
}

export default ForecastedWeather;
