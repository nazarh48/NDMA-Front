import { signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { Layer, Popup, Source, useMap } from "react-map-gl";

export default (props) => {


  // console.log(props.data)

// useEffect(e
// ,[props.data])
// fetch('https://geo.ndma.gov.pk:8443/geoserver/SoP/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SoP%3Apak_admin_boundarypoly_sop&maxFeatures=50&outputFormat=application%2Fjson')
//   .then(response => response.json())
//   .then(data => {
//      const bbox = data.bbox;
//      const centerLng = (bbox[0] + bbox[2]) / 2;
//      const centerLat = (bbox[1] + bbox[3]) / 2;

//      map.fitBounds(bbox, {
//         padding: 19,
//         maxZoom: 18
//       });
//   })
//   .catch(error => console.error(error));



  return (

      <>
        <Source
          id={`${props.data}-source`}
          type="raster"
          tiles={[
//            `https://geo.ndma.gov.pk/geoserver/MHVRA/wms?service=WMS&version=1.1.0&request=GetMap&layers=${props.data}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG%3A3857&format=image/png&transparent=true`
              `http://ndma.ddns.net:8600/geoserver/MHVRA/wms?service=WMS&version=1.1.0&request=GetMap&layers=${props.data}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG%3A3857&format=image/png&transparent=true`
          ]}
          tileSize={256}
        />
        <Layer
          id={`${props.data}-layer`}
          type="raster"
          source={`${props.data}-source`}
          paint={{}}
        />

      </>
    
  );
};
