import React, { useEffect } from "react";
import { useControl } from "react-map-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const DrawControl = (props) => {
  const { position, onCreate, onUpdate, onDelete } = props;

  useControl(
    () => new MapboxDraw(props),
    ({ map }) => {
      console.log("map", map);
      map.on("draw.create", onCreate);
      map.on("draw.update", onUpdate);
      map.on("draw.delete", onDelete);
    },
    ({ map }) => {
      map.off("draw.create", onCreate);
      map.off("draw.update", onUpdate);
      map.off("draw.delete", onDelete);
    },
    {
      position: position,
    },
  );

  useEffect(() => {
    return () => {
      // Clean up event listeners when component unmounts
      if (!props?.getMap || typeof props.getMap !== "function") {
        console.log("No map function available.");
        return;
      }
      const map = props.getMap();
      if (!map) {
        console.log("No map instance available.");
        return;
      }
      map.off("draw.create", onCreate);
      map.off("draw.update", onUpdate);
      map.off("draw.delete", onDelete);
    };
  }, []);

  return null;
};

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
};

export default DrawControl;
