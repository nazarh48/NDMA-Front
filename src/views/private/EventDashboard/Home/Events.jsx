import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import _axios from "../../../../components/Axios";
import CircularProgressWithLabel from "../../../../components/CircularProgressWithLabel";
import Loader from "../../../../components/Loader";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AlertCard = ({ alert }) => {
  const navigate = useNavigate();

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
    <>
      <div className="bg-white text-black rounded-md max-w-md p-4 border border-gray-100">
        <div className="text-xl text-black font-bold">{alert.alert.name}</div>
        <CircularProgressWithLabel value={calculateProgress(alert.progress)} />

        <div className="flex justify-start gap-4">
          <Tooltip title="Activities inprogress with this Alert">
            <span>
              <i className="fa-solid fa-chart-line " /> {alert.activitiesCount}
            </span>
          </Tooltip>

          <Tooltip title="Users involved in this Alert">
            <span>
              {" "}
              <i className="fa-solid fa-user" /> {alert.employeesCount}
            </span>
          </Tooltip>
        </div>

        <div className="flex justify-end">
          <p
            className="text-blue-500  cursor-pointer underline hover:text-blue-900 transition-all text-sm"
            onClick={() => {
              navigate(`/event-dashboard/alertDetailView/${alert.alert.id}`);
            }}
          >
            View Details
          </p>
        </div>
      </div>
    </>
  );
};
const Events = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hazards, setHazards] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [reportingSources, setReportingSources] = useState([]);
  const [vulnerableEntities, setVulnerableEntities] = useState([]);
  const [events, setEvents] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [impactSeverities, setImpactSeverities] = useState([]);
  const [eventSeverities, setEventSeverities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [hazardFilter, setHazardFilter] = useState([]);
  const [hazardFilterTemp, setHazardFilterTemp] = useState();
  const [tierFilter, setTierFilter] = useState([]);
  const [tierFilterTemp, setTierFilterTemp] = useState();
  const [reportingSourceFilter, setReportingSourceFilter] = useState([]);
  const [reportingSourceFilterTemp, setReportingSourceFilterTemp] = useState();
  const [vulnerableEntityFilter, setVulnerableEntityFilter] = useState([]);
  const [vulnerableEntityFilterTemp, setVulnerableEntityFilterTemp] = useState();
  const [eventSeverityFilter, setEventSeverityFilter] = useState([]);
  const [eventSeverityFilterTemp, setEventSeverityFilterTemp] = useState();
  const [impactSeverityFilter, setImpactSeverityFilter] = useState([]);
  const [impactSeverityFilterTemp, setImpactSeverityFilterTemp] = useState();
  const [regionFilter, setRegionFilter] = useState([]);
  const [regionFilterTemp, setRegionFilterTemp] = useState();
  const [tehsilFilter, setTehsilFilter] = useState([]);
  const [tehsilFilterTemp, setTehsilFilterTemp] = useState();
  const [eventFilter, setEventFilter] = useState([]);
  const [eventFilterTemp, setEventFilterTemp] = useState();
  const [showFilters, setShowFilters] = useState(true);
  const [eventType, setEventType] = useState("All");
  const eventTypes = [
    {
      name: "All",
      id: 0,
    },
    {
      name: "Incident",
      id: 1,
    },
    {
      name: "Alert",
      id: 2,
    },
  ];
  useEffect(() => {
    getEvents();
    getHazards();
    getTiers();
    getReportingSources();
    getVulnerableEntities();
    getEventSeverities();
    getRegions();
    getImpactSeverities();
  }, []);
  useEffect(() => {
    if (eventFilter.length > 0 && eventFilter.map((x) => x.id).includes(0)) {
      setEventFilter(events);
    }
  }, [eventFilter]);
  useEffect(() => {
    if (hazardFilter.length > 0 && hazardFilter.map((x) => x.id).includes(0)) {
      setHazardFilter(hazards);
    }
  }, [hazardFilter]);
  useEffect(() => {
    if (tierFilter.length > 0 && tierFilter.map((x) => x.id).includes(0)) {
      setTierFilter(tiers);
    }
  }, [tierFilter]);
  useEffect(() => {
    if (reportingSourceFilter.length > 0 && reportingSourceFilter.map((x) => x.id).includes(0)) {
      setReportingSourceFilter(reportingSources);
    }
  }, [reportingSourceFilter]);

  useEffect(() => {
    if (vulnerableEntityFilter.length > 0 && vulnerableEntityFilter.map((x) => x.id).includes(0)) {
      setVulnerableEntityFilter(vulnerableEntities);
    }
  }, [vulnerableEntityFilter]);
  const getEventsByFilters = async () => {
    try {
      setIsLoading(true);
      console.log(eventType);

      const _eventType = eventType.id === 0 ? "All" : eventType.name;
      const _eventFilter = eventFilter.map((x) => x.id).includes(0)
        ? []
        : eventFilter.map((x) => x.id);
      const _hazardFilter = hazardFilter.map((x) => x.id).includes(0)
        ? []
        : hazardFilter.map((x) => x.id);
      const _tierFilter = tierFilter.map((x) => x.id).includes(0)
        ? []
        : tierFilter.map((x) => x.id);
      const _reportingSourceFilter = reportingSourceFilter.map((x) => x.id).includes(0)
        ? []
        : reportingSourceFilter.map((x) => x.id);
      const _vulnerableEntityFilter = vulnerableEntityFilter.map((x) => x.id).includes(0)
        ? []
        : vulnerableEntityFilter.map((x) => x.id);
      const _regionFilter = regionFilter.map((x) => x.regionId).includes(0)
        ? []
        : regionFilter.map((x) => x.regionId);
      console.log(
        _eventType,
        _hazardFilter,
        _tierFilter,
        _reportingSourceFilter,
        _vulnerableEntityFilter,
        _eventFilter,
      );
      const response = await _axios("post", "/Event/getEventsByFilters", {
        eventType,
        eventId: _eventFilter,
        hazardId: _hazardFilter,
        tierId: _tierFilter,
        reportingSourceId: _reportingSourceFilter,
        vulnerableEntityId: _vulnerableEntityFilter,
        regionId: _regionFilter,
        tehsilId: [],
      });
      if (response.status === 200) {
        console.log(response.data.data);
      }
    } catch (err) {
      console.error(err.message);
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getEvents = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", "/Event/getEvents", null);

      if (response.status === 200) {
        setEvents([...response.data.data]);
        setEventFilter([...response.data.data]);
      }
    } catch (err) {
      console.error(err.message);
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getHazards = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Hazard/getHazards`);
      if (response.status === 200) {
        setHazards([...response.data.data]);
        setHazardFilter([...response.data.data]);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getTiers = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Tier/getTiers`);
      if (response.status === 200) {
        setTiers([...response.data.data]);
        setTierFilter([...response.data.data]);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getReportingSources = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/ReportingSource/getReportingSources`);
      if (response.status === 200) {
        setReportingSources([...response.data.data]);
        setReportingSourceFilter([...response.data.data]);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getVulnerableEntities = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/VulnerableEntity/getVulnerableEntities`);
      if (response.status === 200) {
        setVulnerableEntities([...response.data.data]);
        setVulnerableEntityFilter([...response.data.data]);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getEventSeverities = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/EventSeverity/getEventSeverities`);
      if (response.status === 200) {
        setEventSeverities([...response.data.data]);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getRegions = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Regions/GetRegions`);

      if (response.status === 200) {
        setRegions([...response.data]);
        setRegionFilter([...response.data]);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getTehsilsByRegionsId = async (regionId, index) => {
    try {
      setIsLoading(true);

      const response = await _axios("get", `/Tehsil/getTehsilsByRegionId/${regionId}`);
      if (response.status === 200) {
        setTehsils([...response.data.data]);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getImpactSeverities = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/ImpactSeverities/GetImpactSeverity`);
      if (response.status === 200) {
        setImpactSeverities([
          {
            impactSeverityName: "All",
            impactSeverityId: 0,
          },
          ...response.data,
        ]);
        getEventsByFilters();
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <button
          className="bg-gray-200 text-black px-4 py-1 rounded-md"
          onClick={handleFilterToggle}
        >
          Filters{" "}
          <i
            className={
              showFilters
                ? `fa-solid fa-filter transition-all delay-200`
                : `fa-solid fa-filter-circle-xmark transition-all delay-200`
            }
          ></i>
        </button>
      </div>
      {showFilters && (
        <>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item md={3} sm={6}>
              <TextField
                select
                label="Event Type"
                value={eventType}
                placeholder="Select Event Type"
                onChange={(e) => {
                  setEventType(e.target.value);
                }}
                variant="outlined"
                fullWidth
              >
                {eventTypes.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item md={3} sm={6}>
              <Autocomplete
                multiple
                limitTags={1}
                options={events}
                value={eventFilter}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, newValue) => {
                  setEventFilter(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  console.log(event, newInputValue);
                }}
                renderOption={(props, option, { selected }) => (
                  <>
                    {
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    }
                  </>
                )}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Events" placeholder="Search Event" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={6}>
              <Autocomplete
                multiple
                limitTags={1}
                options={hazards}
                value={hazardFilter}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, newValue) => {
                  setHazardFilter(newValue);
                }}
                fullWidth
                renderOption={(props, option, { selected }) => (
                  <>
                    {
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    }
                  </>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Hazards" placeholder="Search Hazard" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={6}>
              {" "}
              <Autocomplete
                multiple
                limitTags={1}
                options={tiers}
                value={tierFilter}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, newValue) => {
                  setTierFilter(newValue);
                }}
                fullWidth
                renderOption={(props, option, { selected }) => (
                  <>
                    {
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    }
                  </>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Tiers" placeholder="Search Tier" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={6}>
              <Autocomplete
                multiple
                limitTags={1}
                options={reportingSources}
                value={reportingSourceFilter}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, newValue) => {
                  setReportingSourceFilter(newValue);
                }}
                fullWidth
                renderOption={(props, option, { selected }) => (
                  <>
                    {
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    }
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Reporting Sources"
                    placeholder="Search Reporting Source"
                  />
                )}
              />
            </Grid>
            <Grid item md={3} sm={6}>
              <Autocomplete
                multiple
                limitTags={1}
                options={vulnerableEntities}
                value={vulnerableEntityFilter}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, newValue) => {
                  setVulnerableEntityFilter(newValue);
                }}
                fullWidth
                renderOption={(props, option, { selected }) => (
                  <>
                    {
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    }
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Vulnerable Entities"
                    placeholder="People, building, etc"
                  />
                )}
              />
            </Grid>
            <Grid item md={3} sm={6}>
              <Autocomplete
                multiple
                limitTags={1}
                options={regions}
                value={regionFilter}
                disableCloseOnSelect
                getOptionLabel={(option) => option.regionName || ""}
                onChange={(event, newValue) => {
                  setRegionFilter(newValue);
                }}
                fullWidth
                renderOption={(props, option, { selected }) => (
                  <>
                    {
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.regionName}
                      </li>
                    }
                  </>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Regions" placeholder="People, building, etc" />
                )}
              />
            </Grid>
            <Grid item md={1}>
              <button
                className="text-white text-sm  max-h-10 bg-zinc-900 hover:bg-zinc-700"
                onClick={() => {
                  getEventsByFilters();
                }}
              >
                <i className="fa-solid fa-search  "></i>
              </button>
            </Grid>
          </Grid>
        </>
      )}
      {isLoading && <Loader />}
      {/* <div className="grid lg:grid-cols-3">
        {alerts.map((alert, index) => (
          <AlertCard alert={alert} />
        ))}
        {alerts.length == 0 && (
          <div className="flex flex-col items-center justify-center  ">
            <h1 className="text-2xl font-semibold">No Data Found</h1>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Events;
