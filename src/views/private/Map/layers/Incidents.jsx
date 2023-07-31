import { Menu, Grid } from "@mantine/core";
import { Marker, Popup, Source, useMap } from "react-map-gl";
import { useEffect, useState } from "preact/hooks";
import { IconAlertTriangle } from "@tabler/icons";

import { signal } from "@preact/signals-core";
import "../../../../index.css";
import { Link, useNavigate } from "react-router-dom";

export default function Incidents() {
  const [incidentData, setIncidentData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://ndma.ddns.net:8600/geoserver/Incidents/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Incidents%3AIncidents&maxFeatures=50&outputFormat=application%2Fjson",
        );
        const jsonData = await response.json();
        if (jsonData && jsonData.features) {
          const extractedData = jsonData.features.map((feature) => {
            const { id, properties } = feature;

            const extractedDatum = {
              id,
              image: properties.Image,
              time: properties.IncidentDateTime,
              description: properties.IncidentDescription,
              latitude: properties.Latitude,
              longitude: properties.Longitude,
            };

            return extractedDatum;
          });
          setIncidentData(extractedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data initially
    fetchData();

    // Refresh data every 60 seconds
    const intervalId = setInterval(fetchData, 60000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [toggle]);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div>
      <div
        style={{ zIndex: "1" }}
        className="hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer  z-70  p-3 rounded-full text-white bg-components intensity z-1"
        onClick={handleToggle}
      >
        <IconAlertTriangle size={30} />
      </div>
      <div>
        {toggle &&
          incidentData.map((location) => (
            <Marker key={location.id} longitude={location.longitude} latitude={location.latitude}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "red",
                    borderRadius: "50%",
                    position: "absolute",
                    top: -6,
                    left: -6,
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedMarker(location)}
                />
              </div>
            </Marker>
          ))}
      </div>
      {selectedMarker && (
        <Popup
          longitude={selectedMarker.longitude}
          latitude={selectedMarker.latitude}
          onClose={() => setSelectedMarker(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ marginBottom: "5px" }}>
              <div style={{ fontWeight: "bold" }}>
                Description: <br />
              </div>
              {selectedMarker.description}
            </div>
            <div style={{ marginBottom: "5px" }}>
              <div style={{ fontWeight: "bold" }}>
                Date & Time: <br />
              </div>
              <div>
                {new Date(selectedMarker.time)
                  .toLocaleString("en-US", {
                    timeZone: "Asia/Karachi",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(",", "")}
              </div>
            </div>

            <img
              src={selectedMarker.image}
              alt="Incident"
              style={{ width: "100%", maxWidth: "200px", height: "auto" }}
            />
            <div className="controls-div flex justify-end">
              <button
                onClick={() => {
                  navigate("/event-dashboard/alert");
                }}
                className="bg-blue-500 text-white rounded-md p-0.5 px-2 mt-0.5"
              >
                Take Action
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
