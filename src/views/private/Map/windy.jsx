import { Source, Layer, Popup, useMap } from "react-map-gl";
import React, { useState, useEffect } from "react";
import { IconBrandWindows } from "@tabler/icons";

export default function windy(props) {
  const [earthquakes, setEarthquakes] = useState(null);
  const [showEarthquake, setShowEarthquake] = useState(false);

  const map = useMap().current;

  return (
    <>
      <div
        onClick={() => setShowEarthquake(!showEarthquake)}
        className="  hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer     z-70   p-3 rounded-full text-white bg-components shadow-lg"
      >
        <a onClick={()=>{props.showWindy()}} rel="noopener noreferrer">
          <IconBrandWindows size={30} />
        </a>
      </div>
    </>
  );
}
