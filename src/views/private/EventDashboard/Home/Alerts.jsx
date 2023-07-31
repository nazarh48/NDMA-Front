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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AlertCard = ({ alert }) => {
  const navigate = useNavigate();
  console.log(alert);

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

const Alerts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const twoWeeksAgo = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 2 * 1000);
  console.log(twoWeeksAgo);
  const [fromDateFilter, setFromDateFilter] = useState(
    new Date(twoWeeksAgo).toISOString().split("T")[0],
  );
  const [toDateFilter, setToDateFilter] = useState(new Date().toISOString().split("T")[0]);
  const [alertFilter, setAlertFilter] = useState([]);
  const [alertFilterTemp, setAlertFilterTemp] = useState([]);
  const [activityFilter, setActivityFilter] = useState([]);
  const [userFilter, setUserFilter] = useState([]);
  const [userFilterTemp, setUserFilterTemp] = useState({});
  //filters Master arrays
  const [alertFilterMaster, setAlertFilterMaster] = useState([]);
  const [activityFilterMaster, setActivityFilterMaster] = useState([]);
  const [userFilterMaster, setUserFilterMaster] = useState([]);
  useEffect(() => {
    getAlertFilter();
    getAlertsByFilters();
    getUsers();
  }, []);

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };
  const getAlertsByFilters = async () => {
    setIsLoading(true);
    try {
      const _activityFilter =
        activityFilter && activityFilter.map((x) => x.id)?.includes(0) ? [] : activityFilter;

      const _userFilter =
        userFilter && userFilter.map((x) => x.id)?.includes(0) ? [] : userFilter.map((x) => x.id);

      const response = await _axios("post", `Alert/getAlertsInsights`, {
        activityId: _activityFilter,
        alertId: alertFilter ? alertFilter.id : null,
        userId: _userFilter,
        fromDate: fromDateFilter || null,
        toDate: toDateFilter || null,
      });
      if (response.status === 200) {
        setAlerts(response.data.data || []);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const response = await _axios("get", "UserManagement/getUsers", null);

      if (response.status == 200) {
        setUserFilterMaster([
          {
            id: 0,
            name: "All",
          },
          ...response.data.data.map((x) => {
            return { id: x.id, name: x.name };
          }),
        ]);
        setUserFilter([
          {
            id: 0,
            name: "All",
          },
          ...response.data.data.map((x) => {
            return { id: x.id, name: x.name };
          }),
        ]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //filters
  const getAlertFilter = async () => {
    try {
      const response = await _axios("get", "/Alert/getAlerts");
      console.log(response);
      if (response.status === 200) {
        setAlertFilterMaster([
          {
            id: 0,
            name: "All",
          },
          ...response.data.data.map((x) => {
            return { id: x.id, name: x.name };
          }),
        ]);
        setAlertFilter({
          id: 0,
          name: "All",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getActivitiesByAlertId = async () => {
    try {
      if (alertFilterTemp) {
        const response = await _axios(
          "get",
          `/Activity/getActivitiesByAlertId/${alertFilter.id || 0}`,
          null,
        );
        console.log(response);
        if (response.status === 200) {
          setActivityFilterMaster([
            {
              id: 0,
              name: "All",
            },
            ...response.data.data.map((x) => {
              return { id: x.id, name: x.name };
            }),
          ]);
          setActivityFilter([
            {
              id: 0,
              name: "All",
            },
            ...response.data.data.map((x) => {
              return { id: x.id, name: x.name };
            }),
          ]);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    getActivitiesByAlertId();
  }, [alertFilter]);
  useEffect(() => {
    console.log(userFilter);

    if (userFilter.length > 0 && userFilter.map((x) => x.id).includes(0)) {
      setUserFilter(userFilterMaster);
    }
  }, [userFilter]);
  useEffect(() => {
    if (activityFilter.length > 0 && activityFilter.map((x) => x.id).includes(0)) {
      setActivityFilter(activityFilterMaster);
    }
  }, [activityFilter]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <>
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
            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 2 }}>
              <Autocomplete
                value={alertFilter}
                inputValue={alertFilterTemp}
                onChange={(event, newValue) => {
                  console.log(event, newValue);
                  if (newValue == 0) {
                    setAlertFilter(null);
                  } else {
                    setAlertFilter(newValue);
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  setAlertFilterTemp(newInputValue);
                }}
                getOptionLabel={(option) => option.name || ""}
                id="controllable-states-demo"
                options={alertFilterMaster}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField {...params} label="Alerts" />}
              />
              <Autocomplete
                multiple
                limitTags={1}
                id="checkboxes-tags-demo"
                options={activityFilterMaster}
                value={activityFilter}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, newValue) => {
                  console.log(event, newValue);
                  setActivityFilter(newValue);
                }}
                renderOption={(props, option, { selected }) => (
                  <>
                    {console.log(props, option, selected)}
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  </>
                )}
                style={{ width: 250 }}
                renderInput={(params) => (
                  <TextField {...params} label="Activities" placeholder="Search Activity" />
                )}
              />
              <Autocomplete
                multiple
                limitTags={1}
                id="checkboxes-tags-demo"
                options={userFilterMaster}
                value={userFilter}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, newValue) => {
                  console.log(event, newValue);
                  setUserFilter(newValue);
                }}
                style={{ width: 250 }}
                renderOption={(props, option, { selected }) => (
                  <>
                    {console.log(props, option, selected)}
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  </>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Users" placeholder="Search User" />
                )}
              />
              <TextField
                label="From"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                key="from"
                value={fromDateFilter}
                onChange={(e) => {
                  setFromDateFilter(new Date(e.target.value).toISOString().split("T")[0]);
                }}
              />
              <TextField
                label="To"
                type="date"
                onChange={(e) => {
                  setToDateFilter(new Date(e.target.value).toISOString().split("T")[0]);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                value={toDateFilter}
                key="to"
              />

              <button
                className="text-white text-sm  max-h-10 bg-zinc-900 hover:bg-zinc-700"
                onClick={() => {
                  getAlertsByFilters();
                }}
              >
                <i className="fa-solid fa-search  "></i>
              </button>
            </Stack>
          )}
          {isLoading && <Loader />}
        </>
        <div className="grid lg:grid-cols-3">
          {alerts.map((alert, index) => (
            <AlertCard alert={alert} />
          ))}
          {alerts.length == 0 && (
            <div className="flex flex-col items-center justify-center  ">
              <h1 className="text-2xl font-semibold">No Data Found</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Alerts;
