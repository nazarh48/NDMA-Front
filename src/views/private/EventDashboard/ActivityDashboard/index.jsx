import React, { useEffect, useState } from "react";
import _axios from "../../../../components/Axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../../components/DataTable";
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
const index = () => {
  const [activities, setActivities] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getActivities();
  }, []);
  const getActivities = async () => {
    setIsLoading(true);
    try {
      const response = await _axios("get", "Activity/getActivities");
      if (response.status == 200) {
        setActivities(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.error.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleActionEvents = (event, row) => {
    console.log(event, row);
    if (event === "detail") {
      navigate(`/event-dashboard/activityInfo/${row.id}`);
    }
  };
  return (
    <div>
      <DataTable
        showSearch={false}
        columns={columns}
        filterParam="name"
        onActionBtnClicked={(event, row) => {
          handleActionEvents(event, row);
        }}
        data={activities || []}
        title="Activities"
      />
    </div>
  );
};

export default index;
