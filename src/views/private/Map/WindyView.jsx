import React, { useEffect } from "react";

const MapComponent = () => {
  useEffect(() => {
    initiatedMap();

    setTimeout(() => {
      initiatedMap();
    }, 1000);
  }, []);

  const initiatedMap = () => {
    const options = {
      // Required: API key
      key: "kgxHFscUXin32hwUjaOF46iNrwn5kQwG", // REPLACE WITH YOUR KEY !!!
      lat: 33.3,
      lon: 73.3,
      zoom: 4,
    };

    // Initialize Windy API
    window.windyInit(options, (windyAPI) => {
      // windyAPI is ready, and contain 'map', 'store',
      // 'picker' and other useful stuff

      const { picker, utils, broadcast, store } = windyAPI;
      // Set the overlay to "wind" and level to "surface" for Pakistan

      picker.on("pickerOpened", ({ lat, lon, values, overlay }) => {
        // -> 48.4, 14.3, [ U,V, ], 'wind'
        console.log("opened", lat, lon, values, overlay);

        const windObject = utils.wind2obj(values);
        console.log(windObject);
      });

      picker.on("pickerMoved", ({ lat, lon, values, overlay }) => {
        // picker was dragged by user to latLon coords
        console.log("moved", lat, lon, values, overlay);
      });

      picker.on("pickerClosed", () => {
        // picker was closed
      });

      store.on("pickerLocation", ({ lat, lon }) => {
        console.log(lat, lon);

        const { values, overlay } = picker.getParams();
        console.log("location changed", lat, lon, values, overlay);
      });
      store.set("latlon", [30.375, 69.345]);

      // Wait since wather is rendered
      broadcast.once("redrawFinished", () => {
        // Opening of a picker (async)
        picker.open({ lat: 33.3, lon: 73.3 });

        // addWmsLayer(windyAPI);
      });

      // .map is an instance of Leaflet map
    });
  };
  return <div id="windy" />;
};

export default MapComponent;
