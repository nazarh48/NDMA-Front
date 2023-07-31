import React, { useEffect } from "react";
import { toast } from "react-toastify";
import _axios from "../../../../components/Axios";
import DataTable from "../../../../components/DataTable";
import Dialog from "./Dialog";
import Swal from "sweetalert2";

const columns = [
  {
    id: "actions",
    type: "actions",
    label: "Actions",
    actions: [
      {
        className: "fa-solid fa-trash text-red-500 text-xl cursor-pointer hover:text-red-600",
        action: "delete",
        actionType: "normal",
      },
      {
        className:
          "fa-solid fa-pen-to-square  text-gray-500 text-xl cursor-pointer hover:text-gray-600",
        action: "edit",
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
    id: "typeName",
    type: "chip",
    label: "Type",
    trueClass: "bg-green-500 text-white",
    falseClass: "bg-red-500 text-white",
  },
];

const index = () => {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState({});
  const [onEdit, setOnEdit] = React.useState(false);
  const [activityMasterTypes, setActivityMasterTypes] = React.useState([]);

  useEffect(() => {
    getMasterActivities();
    getActivityMasterTypes();
  }, []);
  const getMasterActivities = async () => {
    try {
      const response = await _axios("get", "/ActivityMaster/getMasterActivities");
      console.log(response);
      if (response.status === 200) {
        setData(response.data.data || []);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getActivityMasterTypes = async () => {
    try {
      const response = await _axios("get", "/ActivityMasterType/getActivityMasterTypeList");
      if (response.status === 200) {
        console.log(response.data.data);
        setActivityMasterTypes(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteActivity = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this Activity! It might also delete all the related data of this Activity.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await _axios("delete", `/ActivityMaster/deleteMasterActivity/${id}`);
          if (response.status === 200) {
            toast.success(response.data.message);
            getMasterActivities();
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    });
  };
  const handleActionEvents = (event, row) => {
    console.log(event, row);
    if (event === "add") {
      console.log("add");
      setOpen(true);
    }
    if (event === "edit") {
      setOnEdit(true);
      setRow(row);
      setOpen(true);
    }
    if (event === "delete") {
      deleteActivity(row.id);
    }
  };
  return (
    <div>
      <DataTable
        title="Activity Master"
        columns={columns}
        data={data}
        onActionBtnClicked={(event, row) => {
          handleActionEvents(event, row);
        }}
        filterParam={"name"}
      />
      <Dialog
        open={open}
        onEdit={onEdit}
        onClose={() => {
          setOpen(false);
          setOnEdit(false);
          setRow({});
        }}
        onRefresh={() => {
          getMasterActivities();
        }}
        row={row}
        activityMasterTypes={activityMasterTypes}
      />
    </div>
  );
};

export default index;
