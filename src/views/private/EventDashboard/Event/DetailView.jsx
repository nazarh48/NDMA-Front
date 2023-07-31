import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CircularProgressWithLabel from "../../../../components/CircularProgressWithLabel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import MiniTable from "../../../../components/MiniTable";
import { toast } from "react-toastify";
import _axios from "../../../../components/Axios";
import DataTable from "../../../../components/DataTable";
import { useNavigate } from "react-router-dom";
import MapDialog from "./MapDemo";

const columns = [
  {
    id: "actions",
    type: "actions",
    label: "Actions",
    actions: [
      {
        className:
          "fa-solid fa-info  text-gray-500 text-xl cursor-pointer  bg-gray-200 p-3 rounded-xl hover:bg-gray-300",
        action: "detail",
        actionType: "normal",
      },
    ],
  },
  {
    id: "name",
    type: "text",
    label: "Name",
  },

  {
    id: "activityStatus",
    type: "text",
    label: "Activity Status",
  },

  {
    id: "createdAt",
    type: "date",
    label: "Created On",
  },
  {
    id: "progress",
    type: "progress-bar",
    label: "Progress",
  },
];
const eventImpactsColumns = [
  {
    id: "impactSeverity",
    type: "text",
    label: "Impact Severity",
  },
  {
    id: "vulnerableEntity",
    type: "text",
    label: "Impact on",
  },
  {
    id: "displacements",
    type: "text",
    label: "Displacements",
  },
  {
    id: "casualities",
    type: "text",
    label: "Casualities",
  },
  {
    id: "region",
    type: "text",
    label: "Affected Region",
  },
  {
    id: "tehsil",
    type: "text",
    label: "Affected Tehsil",
  },
  {
    id: "hasGeometry",
    type: "button",
    label: "Polygon",
    btnText: "View Map",
  },
];
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const AlertDetailView = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentGeoJson, setCurrentGeoJson] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [value, setValue] = React.useState(0);
  const [eventInfo, setEventInfo] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getEventInfoById();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setCopySuccess(false);
    }, 3000);
  }, [copySuccess]);

  const handleCopy = () => {
    const latLong = eventInfo?.latitude + "," + eventInfo?.longitude;
    navigator.clipboard
      .writeText(latLong)
      .then(() => setCopySuccess(true))
      .catch(() => setCopySuccess(false));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getEventInfoById = async () => {
    console.log(id);
    try {
      if (id) {
        const response = await _axios("get", `/Event/getEventById/${id}`);
        console.log(response);
        if (response.status == 200) {
          if (response.data.data) {
            setEventInfo(response.data.data);
          }
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleActionEvents = (event, row) => {
    console.log(event, row);
    if (event === "detail") {
      navigate(`/event-dashboard/activityInfo/${row.id}`);
    }
  };

  const calculateProgress = (progress) => {
    if (!progress) return 0;

    const filteredProgress = progress.filter((x) => x !== null);

    if (filteredProgress.length === 0) return 0;

    const sum = filteredProgress.reduce((a, b) => a + b, 0);
    const average = sum / filteredProgress.length;
    const roundedAverage = average.toFixed(2);

    return parseFloat(roundedAverage) || 0;
  };

  return (
    <div className="h-screen">
      {" "}
      <Card sx={{ minWidth: 275, borderRadius: "20px" }}>
        <CardContent>
          <div className="flex justify-between">
            <Typography variant="h3" gutterBottom>
              {console.log(eventInfo.name)}
              {eventInfo?.name}
            </Typography>
            <CircularProgressWithLabel value={calculateProgress(eventInfo.progress)} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="bg-blue-500 text-white rounded-full px-3 py-1 max-w-max">
              {eventInfo?.eventType}
            </span>
            <span className="bg-red-500 text-white rounded-full px-3 py-1 max-w-max">
              {" "}
              {eventInfo?.eventSeverity}
            </span>
            <span className=" text-gray-500 rounded-full   px-3 py-1  max-w-max">
              {eventInfo.createdBy}
            </span>
            {/* <Tooltip title="Click to copy">
              <span
                className=" text-gray-500 rounded-full px-3 py-1   max-w-max text-sm hover:bg-gray-200 cursor-pointer"
                onClick={handleCopy}
              >
                <i className="fa-solid fa-location-dot "></i> {eventInfo?.latitude},{" "}
                {eventInfo?.longitude}
              </span>
            </Tooltip>
            {copySuccess && <span className="text-blue-500 ml-1 text-sm">Copied!</span>} */}
            <div className="flex justify-start gap-4 px-3 py-1">
              <Tooltip title="Activities inprogress in this Alert">
                <span>
                  <i className="fa-solid fa-chart-line " /> {eventInfo.activitiesCount}
                </span>
              </Tooltip>

              <Tooltip title="Users involved in this Alert">
                <span>
                  {" "}
                  <i className="fa-solid fa-user" /> {eventInfo.employeesCount}
                </span>
              </Tooltip>
            </div>
          </div>
          <Box sx={{ width: "100%", mt: 5 }}>
            {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                {eventInfo?.activities?.map((activity, index) => (
                  <Tab label={activity.name} key={index} />
                ))}
              </Tabs>
            </Box> */}
            <MapDialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              geojson={(e) => {
                console.log(currentIndex);

                handleGeojsonChange(e);
              }}
              currentGeometry={currentGeoJson}
              title="Impacted areas are highlighted in green"
            />
            <Box sx={{ width: "100%", mt: 5 }}>
              <DataTable
                showSearch={false}
                columns={eventImpactsColumns}
                filterParam={"vulnerableEntity"}
                onActionBtnClicked={(event, row) => {
                  handleActionEvents(event, row);
                }}
                data={eventInfo?.eventImpacts || []}
                title="Event Impacts"
                onBtnClicked={(event, row) => {
                  console.log(event, row);
                  setOpen(true);
                  //setCurrentIndex(index);
                  setCurrentGeoJson({
                    type: "FeatureCollection",
                    features: row.features.map((x) => JSON.parse(x.geometry)),
                  });
                }}
              />
            </Box>
            <Box sx={{ width: "100%", mt: 5 }}>
              <DataTable
                showSearch={false}
                columns={columns}
                filterParam={"name"}
                onActionBtnClicked={(event, row) => {
                  handleActionEvents(event, row);
                }}
                data={eventInfo?.activities || []}
                title="Activities"
              />
            </Box>
          </Box>
        </CardContent>
        <CardActions>{/* <Button size="small">Learn More</Button> */}</CardActions>
      </Card>
    </div>
  );
};

export default AlertDetailView;
