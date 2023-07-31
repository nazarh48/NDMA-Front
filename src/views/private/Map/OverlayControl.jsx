import { Menu } from "@mantine/core";
import { signal } from "@preact/signals";
import { IconStack2 } from "@tabler/icons";
import { useEffect, useMemo, useState } from "preact/hooks";
import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Center } from "@mantine/core";

export const test = signal([
  //*************** */ TO DESIGN TOTAL COUNT OF LAYERS AUTOMETICALLYS***********************
  {
    title: "Boundaries",
    type: "divider",
  },
  ////////////////   BOUNDARIES //////////////////
  {
    title: "Political/Provincial Boundary-SoP",
    name: "SoP:PoliticalMap — Boundary",
    label: "PoliticalMap — Boundary",
    visible: false,
    type: "checkbox",
    workspace: "SoP",
  },
  // {
  //   title: "Provincial Boundaries",
  //   name: "MHVRA:provincial_boundary",
  //   label: "provincial_boundary",
  //   visible: false,
  //   type:"checkbox",workspace: "MHVRA",
  // },

  // {
  //   title: "Provincial Boundaries-RAU",
  //   name: "MHVRA:administrtative_boundaries",
  //   label: "administrtative_boundaries",
  //   visible: false,
  //   type:"checkbox",workspace: "MHVRA",
  // },
  {
    title: "District Boundaries-SoP",
    name: "SoP:pak_admin_boundarypoly_sop",
    label: "pak_admin_boundarypoly_sop",
    visible: false,
    type: "checkbox",
    workspace: "SoP",
  },
  {
    title: "District Boundaries-RAU",
    name: "MHVRA:district boundary",
    label: "district boundary",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Tehsil Boundary-RAU",
    name: "MHVRA:tehsil boundary",
    label: "tehsil boundary",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },

  /////////////////  FLOOD ANALYSIS    /////////////
  {
    title: "Rivers and Streams",
    type: "divider",
  },
  {
    title: "Dams and Water Bodies-RAU",
    name: "MHVRA:dams_water_bodies",
    label: "dams_water_bodies",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "River Headworks-RAU",
    name: "MHVRA:river headworks",
    label: "river headworks",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Bridges Point-SOP",
    name: "SoP:Road_Bridges_Point_SOP",
    label: "Road_Bridges_Point_SOP",
    visible: false,
    type: "checkbox",
    workspace: "SoP",
  },
  {
    title: "Rivers-RAU",
    name: "MHVRA:rivers",
    label: "rivers",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Streams and Nullah-RAU",
    name: "MHVRA:	streams and nullah",
    label: "streams and nullah",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "River Flow Data-FFD",
    name: "FFD:flood_data",
    label: "flood_data",
    visible: false,
    type: "checkbox",
    workspace: "FFD",
  },
  {
    title: "Flood Simulation",
    label: "river_animation",
    name: "FFD:river_animate_2",
    visible: false,
    type: "checkbox",
    workspace: "FFD",
  },

  ////////////////////   GLOF   //////////////////
  {
    title: "Lakes",
    type: "divider",
  },
  {
    title: "Vulnerable Glacial Lakes-RAU",
    name: "MHVRA:vulnerable_glacial_lakes",
    label: "vulnerable_glacial_lakes",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },

  ///////////////// TRANSPORTATION NETWORK //////////////////////
  {
    title: "Transportation",
    type: "divider",
  },
  {
    title: "NHA Road Network-NHA",
    name: "NHA:NHA_Road_Network",
    label: "NHA_Road_Network",
    visible: false,
    type: "checkbox",
    workspace: "NHA",
  },
  {
    title: "Roads Line-SoP",
    name: "SoP:Roads_Line_SOP",
    label: "Roads_Line_SOP",
    visible: false,
    type: "checkbox",
    workspace: "SoP",
  },
  {
    title: "Railway Line-SoP",
    name: "SoP:Railway_Line_SOP",
    label: "Railway_Line_SOP",
    visible: false,
    type: "checkbox",
    workspace: "SoP",
  },
  {
    title: "Railway Tracks-RAU",
    name: "MHVRA:railway tracks",
    label: "railway tracks",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Airports-SoP",
    name: "MHVRA:airports",
    label: "airports",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  // {
  //   name: "MHVRA:major roads",
  //   label: "major roads",
  //   visible: false,
  //   type:"checkbox",workspace: "MHVRA",
  // },
  // {
  //   name: "MHVRA:motorways",
  //   label: "motorways",
  //   visible: false,
  //   type:"checkbox",workspace: "MHVRA",
  // },

  ///////////////////  CITIES  and SETTLEMENTS     /////////////////////////////
  {
    title: "Cities and Settlements",
    type: "divider",
  },
  {
    title: "District Capitals-RAU",
    name: "MHVRA:district capitals",
    label: "district capitals",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Major Cities-RAU",
    name: "MHVRA:major cities",
    label: "major cities",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Tehsil HQs-SoP",
    name: "SoP:Road — Block_Point - DistTehsil HQs",
    label: "Road — Block_Point - DistTehsil HQs",
    visible: false,
    type: "checkbox",
    workspace: "SoP",
  },
  {
    title: "Settlements-RAU",
    name: "MHVRA:settlements",
    label: "settlements",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },

  ////////////////////// SEISMIC DATA      ////////////////////////
  {
    title: "Seismic Data",
    type: "divider",
  },
  {
    title: "Peak Ground Acceleration-RAU",
    name: "MHVRA:pga",
    label: "pga",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Faultlines-RAU",
    name: "MHVRA:faultlines",
    label: "faultlines",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Geology-RAU",
    name: "MHVRA:geology",
    label: "geology",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },

  //////////////////  STAKEHOLDERS DATA    //////////////////////
  {
    title: "Stakeholders Data",
    type: "divider",
  },
  {
    title: "Wheat Production-MNFSR",
    name: "MNFSR:production_view3",
    label: "production_view3",
    visible: false,
    type: "checkbox",
    workspace: "MNFSR",
  },

  {
    title: "District Population-PBS",
    name: "PBS:district_population_pbs",
    label: "district_population_pbs",
    visible: false,
    type: "checkbox",
    workspace: "PBS",
  },

  {
    title: "NGOs Data-NDMA",
    name: "NGO:ngos_view",
    label: "ngos_view",
    visible: false,
    type: "checkbox",
    workspace: "NGO",
  },

  ///////////////////  COASTLINES and SEAPORTS      /////////////////////
  {
    title: "Coastlines and Seaports",
    type: "divider",
  },
  {
    title: "Coastline-RAU",
    name: "MHVRA:coastline",
    label: "coastline",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Coastline Areas-RAU",
    name: "MHVRA:coastline areas",
    label: "coastline areas",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },
  {
    title: "Seaports-RAU",
    name: "MHVRA:seaports",
    label: "seaports",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },

  ////////////////////////////////////////
  {
    title: "Health",
    type: "divider",
  },
  {
    title: "Health Facilities-RAU",
    name: "MHVRA:health facilities",
    label: "health facilities",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },

  {
    title: "Humanitarian Relief Facilities-RAU",
    name: "MHVRA:hrf",
    label: "hrf",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },

  ////////////   INFRASTRUCTURES  ///////////////
  {
    title: "Infrastructures",
    type: "divider",
  },
  {
    title: "Hydel Power Stations-RAU",
    name: "MHVRA:hydel power stations",
    label: "hydel power stations",
    visible: false,
    type: "checkbox",
    workspace: "MHVRA",
  },

  // {
  //   name: "PMD:synop_currentdata",
  //   label: "synop_currentdata",
  //   visible: false,
  //   type:"checkbox",workspace: "PMD",
  // },
  // {
  //   name: "PMD:nwp_forecast_3_days",
  //   label: "nwp_forecast_3_days",
  //   visible: false,
  //   type:"checkbox",workspace: "PMD",
  // },
  // {
  //   name: "PMD:getcurrent_pmd",
  //   label: "getcurrent_pmd",
  //   visible: false,
  //   type:"checkbox",workspace: "PMD",
  // },
]);

export const _selectedLayer = signal(null);

export var coordinateArr = signal([]);

export var isFloodSimulationLayerChecked = signal(false);

function handleCheckboxChange(event, element, setSelectedLayer) {
  const { name, checked } = event.target;

  const newLayers = test.value.map((layer) => {
    if (layer.name === name) {
      return {
        ...layer,
        visible: checked,
      };
    }
    return layer;
  });

  test.value = newLayers;

  const checkedLayers = newLayers.filter((layer) => layer.visible);
  if (checkedLayers.length === 0) {
    _selectedLayer.value = null;
    setSelectedLayer(null);
  } else if (checked) {
    _selectedLayer.value = element.title;
    setSelectedLayer(name);
  } else {
    const lastCheckedLayer = checkedLayers[checkedLayers.length - 1];
    _selectedLayer.value = lastCheckedLayer.title;
    setSelectedLayer(lastCheckedLayer.name);
  }

  //c-here var (name) was used
  fetch(`
  
https://ndma.kfacon.com:8443/geoserver/SoP/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SoP:Rivers_Line_SOP&maxFeatures=50&outputFormat=application%2Fjson`)
    .then((response) => response.json())
    .then((data) => {
      // console.log("Coordinates: ", data.features);
    });

  // checking if flood simulation layer is checked,
  // if it is then we show the rivers dropdown, using this in Map.jsx file
  isFloodSimulationLayerChecked.value = checkedLayers.some(
    (layer) => layer.name === "FFD:river_animate_2"
  );
}

export default function OverlayControl() {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const layers = useMemo(() => test.value, [test.value]);
  const [isHovered, setIsHovered] = useState(false);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    const checkedLayers = test.value.filter((layer) => layer.visible);

    if (checkedLayers.length == 0) {
      setSelectedLayer(null);
      _selectedLayer.value = null;
    }
  }, [test.value]);

  const handleCrossButton = () => {
    const checkedLayers = test.value.filter((layer) => layer.visible);
    if (checkedLayers.length > 0) {
      const lastCheckedLayer = checkedLayers[checkedLayers.length - 1];
      lastCheckedLayer.visible = false;
      test.value = [...test.value]; // Trigger reactivity in the signal

      // Update the _selectedLayer value
      if (_selectedLayer.value === lastCheckedLayer.name) {
        const previousLayer = checkedLayers[checkedLayers.length - 2];
        _selectedLayer.value = previousLayer ? previousLayer.name : null;
      }
    } else {
      setSelectedLayer(null);
      _selectedLayer.value = null;
    }
    const lastIndexValue = checkedLayers.reverse().find((x) => x.visible);
    if (lastIndexValue) {
      setSelectedLayer(lastIndexValue.label);
      _selectedLayer.value = lastIndexValue.title;
    }
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <List>
        {test.value.map((text, index) => {
          return (
            <>
              {text.type == "checkbox" && (
                <ListItem key={text.label} disablePadding>
                  <ListItemButton>
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        name={text.name}
                        onChange={(e) =>
                          handleCheckboxChange(e, text, setSelectedLayer)
                        }
                        checked={text.visible}
                      />
                      {<span className="capitalize ml-2">{text.title}</span>}
                    </label>
                  </ListItemButton>
                </ListItem>
              )}
              {text.type == "divider" && (
                <p className="px-2 text-sm text-gray-500 mb-1 font-bold">
                  {text.title}
                </p>
              )}
            </>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <div>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
        <div
          id="overlaycontrol"
          className=" hover:scale-95 border-white border-solid border-2 transition-all cursor-pointer bottom-24   z-70  p-3 rounded-full text-white bg-components shadow-lg"
          onClick={toggleDrawer("right", true)}
        >
          <IconStack2 size={30} />
        </div>

        <button
          onClick={handleCrossButton}
          className="cross"
          style={{ display: selectedLayer ? "block" : "none" }}
        >
          x
        </button>
      </div>
      {selectedLayer ? (
        <Center>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "-95vmax",
              backgroundColor: "white",
              padding: "20px",
              overflow: "auto",
              maxHeight: "50vh",
              maxWidth: isHovered ? "60vw" : "30vw",
              transition: "0.3s ease-in",
            }}
            className="legend"
          >
            <Center>
              <h2
                style={{
                  borderBottom: "4px ridge",
                  fontSize: "22px",
                  fontFamily: "Inter",
                  padding: "2px",
                }}
              >
                Legend
              </h2>
            </Center>
            <img
              src={`http://ndma.ddns.net:8600/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=${selectedLayer}`}
              style={{
                display: selectedLayer ? "block" : "none",
                padding: "10px",
                objectFit: "contain",
              }}
              alt="Layers_legends"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        </Center>
      ) : (
        ""
      )}
    </>
  );
}
