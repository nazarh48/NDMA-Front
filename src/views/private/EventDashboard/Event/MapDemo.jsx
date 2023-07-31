import "@maptiler/sdk/dist/maptiler-sdk.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Map, Source } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import ControlPanel from "./Control-panel";
import DrawControl from "./Draw-control";
import GeocoderControl from "./GeocoderControl";

const apiKey = "Fbb9bsvj7tIEC7vzB2TD";
const TOKEN =
  "pk.eyJ1IjoiZGFqbWEwMCIsImEiOiJjbGo3NThla20wdDVoM3BueHU4cWQwY2R2In0.Ajx0B2drdxtMpRXGSb2D_Q"; // Set your mapbox token here

const MapDemo = ({ open, onClose, geojson, currentGeometry, title }) => {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const [features, setFeatures] = useState({});
  useEffect(() => {
    console.log("currentGeometry", currentGeometry);
  }, []);
  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };

      for (const f of e.features) {
        newFeatures[f.id] = f;
      }

      geojson(Object.values(newFeatures));
      console.log(newFeatures);
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }

      geojson(Object.values(newFeatures));
      console.log(newFeatures);

      return newFeatures;
    });
  }, []);

  const _geojson = {
    id: "87c9b752a604c7a2b1c0fabb8aea7dd1",
    type: "Feature",
    properties: {},
    geometry: {
      coordinates: [
        [
          [-79.47606626702337, 43.66454364569543],
          [-79.48113225280704, 43.67243156339731],
          [-79.46859608459643, 43.67522624614443],
          [-79.46043898884231, 43.66795980029934],
          [-79.47606626702337, 43.66454364569543],
        ],
        [
          [-79.45915102635487, 43.66230751195522],
          [-79.46370182714368, 43.652119626474416],
          [-79.44678658647584, 43.651125593882284],
          [-79.44077609486796, 43.664170962522945],
          [-79.45915102635487, 43.66230751195522],
        ],
        [
          [-79.49727276031967, 43.68939310909761],
          [-79.49664865152762, 43.681419789774736],
          [-79.48167004052384, 43.68503048076258],
          [-79.48811916470576, 43.69119824180342],
          [-79.49727276031967, 43.68939310909761],
        ],
      ],
      type: "Polygon",
    },
  };

  const layerStyle = {
    id: "maine",
    type: "fill",
    source: "maine",
    layout: {},
    paint: {
      "fill-color": "#088",
      "fill-opacity": 0.8,
    },
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <div
          style={{
            height: "100vh",
            width: "100%",
          }}
        >
          <Map
            initialViewState={{
              longitude: -79.4512,
              latitude: 43.6568,
              zoom: 13,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={TOKEN}
            ref={mapContainer}
          >
            <Source id="my-data" type="geojson" data={currentGeometry}>
              <Layer {...layerStyle} />
            </Source>
            <GeocoderControl mapboxAccessToken={TOKEN} position="top-left" />
            <DrawControl
              position="top-left"
              displayControlsDefault={false}
              controls={{
                polygon: true,
                trash: true,
              }}
              defaultMode="draw_polygon"
              onCreate={onUpdate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </Map>
        </div>
        <ControlPanel polygons={Object.values(features)} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Submit & Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapDemo;
