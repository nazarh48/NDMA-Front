import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import _axios from "../../../components/Axios";
import CircularProgressWithLabel from "../../../components/CircularProgressWithLabel";
import Loader from "../../../components/Loader";

const ActivityInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activity, setActivity] = useState({});
  const [warehouseLatLongCopySuccess, setWarehouseLatLongCopySuccess] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    getActivityInfoById();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setWarehouseLatLongCopySuccess(false);
    }, 3000);
  }, [warehouseLatLongCopySuccess]);
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleWarehouseLatLongCopy = (lat, long) => {
    const latLong = lat + "," + long;
    navigator.clipboard
      .writeText(latLong)
      .then(() => setWarehouseLatLongCopySuccess(true))
      .catch(() => setWarehouseLatLongCopySuccess(false));
  };

  const getActivityInfoById = async () => {
    setIsLoading(true);
    try {
      if (id) {
        const response = await _axios("get", `Activity/getActivityInfoById/${id}`);
        if (response.status == 200) {
          console.log(response.data);
          setActivity(response.data.data);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Card sx={{ minWidth: 275, borderRadius: "20px" }}>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="lg:text-2xl text-black font-bold">{activity.name}</h1>
                <CircularProgressWithLabel value={activity.progress || 0} />
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 text-sm">{activity.activityStatus}</span>
                <Divider orientation="vertical" flexItem />
                <span className="text-gray-500 text-sm">{activity.progress || 0}%</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 text-sm">
                  <div className="flex gap-3">
                    <span>
                      <i className="fa-solid fa-calendar-days"></i>{" "}
                      <span className="text-gray-600 font-semibold">Creation Date:</span>
                    </span>
                    <span> {formatDate(activity.createdAt)}</span>
                    <Divider orientation="vertical" flexItem />
                    <span>
                      <i className="fa-solid fa-clock"></i>{" "}
                      <span className="text-gray-600 font-semibold">Creation Time:</span>
                    </span>
                    <span> {formatTime(activity.createdAt)}</span>
                  </div>
                </span>

                <span className="text-gray-500 text-sm">
                  <div className="flex gap-3">
                    {activity.expectedCompletionDate && (
                      <>
                        <span>
                          <i className="fa-solid fa-calendar-days"></i> Expected Completion Date
                        </span>
                        <span> 12/12/2021</span>
                      </>
                    )}
                  </div>
                </span>
              </div>
              <Divider sx={{ mt: 2 }} />
              <div className="mt-2">
                <h1 className="lg:text-2xl text-black font-bold">Warehouse Information</h1>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-md text-gray-500 px-3 max-w-max">
                    {activity?.warehouse?.name}
                  </div>
                  <Tooltip title="Click to copy">
                    <div
                      className="text-sm text-gray-500 px-3 py-1 max-w-max rounded-full hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        handleWarehouseLatLongCopy(
                          activity?.warehouse?.latitude,
                          activity?.warehouse?.longitude,
                        );
                      }}
                    >
                      <i className="fa-solid fa-location-dot "></i> {activity?.warehouse?.latitude},{" "}
                      {activity?.warehouse?.longitude}
                      {warehouseLatLongCopySuccess && (
                        <span className="text-blue-500 ml-1 text-sm">Copied!</span>
                      )}
                    </div>
                  </Tooltip>
                  <div className="text-sm text-gray-500 px-3 py-1 max-w-max">
                    <i className="fa-solid fa-location-crosshairs mr-1"></i>
                    {activity?.warehouse?.address}, {activity?.warehouse?.city}
                  </div>
                </div>
              </div>
              <Divider sx={{ mt: 2 }} />
              <div className="mt-2">
                <h1 className="lg:text-2xl text-black font-bold">Inventory Sent</h1>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex flex-row gap-3 items-center">
                    <span className="text-md text-gray-700 max-w-max">Inventory</span>
                    <Divider orientation="vertical" flexItem />
                    <span className="text-sm text-gray-500 max-w-max">
                      {activity?.inventory?.inventoryType}
                    </span>
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <div className="text-gray-700 max-w-max">Quantity</div>
                    <Divider orientation="vertical" flexItem />
                    <div className="text-sm text-gray-500 max-w-max">
                      {activity.inventoryToSend} ({activity?.inventory?.unit})
                    </div>
                  </div>
                </div>
              </div>
              <Divider sx={{ mt: 2 }} />
              <div className="mt-2">
                <h1 className="lg:text-2xl text-black font-bold">Assignees</h1>
                <div className="flex flex-col gap-2 mt-2">
                  <Stack direction="row" spacing={1}>
                    {" "}
                    {activity?.activityEmployees?.map((assignee) => (
                      <Chip label={assignee.name} className="capitalize" />
                    ))}
                  </Stack>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ActivityInfo;
