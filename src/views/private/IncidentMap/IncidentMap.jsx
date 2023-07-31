import React, { useState, useEffect, useRef } from "react";
import _axios from "../../../components/Axios";
import Preloader from "../../../components/Preloader";
import { IconLayer } from '@deck.gl/layers';
import { toast } from 'react-toastify';
import { DeckGL } from "deck.gl";
import { TileLayer, MapContainer } from "react-leaflet";

export default function IncidentMap() {

    let [preloader, togglePreloader] = useState(false);

    let [incidentArr, setIncidentArr] = useState([]);


    useEffect(() => {
        //togglePreloader(true);
        //getIncidents();
    }, []);

    const getIncidents = () => {
        _axios("get", "Incidents/GetIncidents").then((res) => {
            setIncidentArr(res.data);
            togglePreloader(false);
        },
            (error) => {
                toast.error("Something went wrong, Cannot ReportGet Incidents!");
            });
    }

    const ICON_MAPPING = {
        marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
    };


    const data = [
        { name: 'Colma (COLM)', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [74.25463953090657, 31.470025697162672] },
    ]


    const layer = new IconLayer({
        id: 'icon-layer',
        data,
        pickable: true,
        // iconAtlas and iconMapping are required
        // getIcon: return a string
        iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker',

        sizeScale: 15,
        getPosition: d => d.coordinates,
        getSize: d => 5,
        getColor: d => [Math.sqrt(d.exits), 140, 0]
    });

    const viewState = {
        longitude: 74.33157997814813,
        latitude: 31.48368912715047,
        zoom: 11,
        maxZoom: 20,
        pitch: 30,
        bearing: 0
    }

    const mapCenter = [31.48368912715047, 74.33157997814813];
    const zoomLevel = 11;




    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        <Preloader togglePreloader={preloader} />
        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
        >
          {/* ... */}
        </MapContainer>
        <DeckGL
          viewState={viewState}
          layers={[layer]}
          getTooltip={({ object }) => object && `${object.name}\n${object.address}`}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
        />
      </div>
    )
}
