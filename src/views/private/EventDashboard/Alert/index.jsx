import React from "react";
import _axios from "../../../../components/Axios";
import { toast } from "react-toastify";
import DataTable from "../../../../components/DataTable";
import Dialog from "./Dialog";
import ActionDialog from "./ActionDialog";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    id: "actions",
    type: "actions",
    label: "Actions",
    actions: [
      {
        className:
          "fa-solid fa-pen-to-square  text-gray-500 text-full cursor-pointer hover:text-gray-600 p-1",
        action: "edit",
        actionType: "normal",
      },
      {
        className: "fa-solid fa-trash text-red-500 text-full cursor-pointer hover:text-red-600",
        action: "delete",
        actionType: "normal",
      },
      {
        className: "fa-solid fa-truck-fast text-black text-full cursor-pointer hover:text-zinc-700",
        action: "activity",
        actionType: "normal",
      },
      {
        className:
          "fa-solid fa-info  text-gray-500 text-full cursor-pointer hover:text-gray-600 p-1",
        action: "details",
        actionType: "normal",
      },
      {
        className: "fa-solid fa-user text-black text-full cursor-pointer hover:text-zinc-700",
        action: "view",
        actionType: "conditional",
        condition: "status:active",
      },
      {
        className: "fa-solid fa-user-slash text-black text-full cursor-pointer hover:text-zinc-700",
        action: "view",
        actionType: "conditional",
        condition: "status:inactive",
      },
    ],
  },
  {
    id: "name",
    type: "text",
    label: "Name",
  },
  {
    id: "alertTypeName",
    type: "chip",
    label: "Type",
    trueClass: "bg-green-500 text-white",
    falseClass: "bg-red-500 text-white",
  },
  {
    id: "alertSeverityName",
    type: "text",
    label: "Severity",
  },
  {
    id: "createdBy",
    type: "text",
    label: "Created By",
  },
  {
    id: "createdAt",
    type: "date",
    label: "Created On",
  },
  {
    id: "latitude",
    type: "text",
    label: "Latitude",
  },
  {
    id: "longitude",
    type: "text",
    label: "Longitude",
  },
  {
    id: "activitiesCount",
    type: "text",
    label: "Activities",
  },
];

const index = () => {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openAction, setOpenAction] = React.useState(false);
  const [row, setRow] = React.useState({});
  const [onEdit, setOnEdit] = React.useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    getData();
  }, []);

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
    if (event === "activity") {
      setOpenAction(true);
      setRow(row);
    }
    if (event === "details") {
      navigate(`/event-dashboard/alertDetailView/${row.id}`);
    }
  };

  const getData = async () => {
    try {
      const response = await _axios("get", "/Alert/getAlerts", null);
      console.log(response);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error(err.message);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div>
      <DataTable
        title="Event"
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
          getData();
        }}
        row={row}
      />
      <ActionDialog
        open={openAction}
        onClose={() => {
          setOpenAction(false);
          setRow({});
        }}
        onRefresh={() => {
          getData();
        }}
        row={row}
      />
    </div>
  );
};

export default index;
