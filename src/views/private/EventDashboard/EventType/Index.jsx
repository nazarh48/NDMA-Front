import React from "react";
import Dialog from "./Dialog";
import DataTable from "../../../../components/DataTable";
import { useEffect } from "react";
import _axios from "../../../../components/Axios";
import Swal from "sweetalert2";
import Loader from "../../../../components/Loader";
import { toast } from "react-toastify";

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
    id: "color",
    type: "color",
    label: "Color",
  },
];

const Index = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState({});
  const [onEdit, setOnEdit] = React.useState(false);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/EventType/getEventTypes`);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
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
      handleDelete(row);
    }
  };

  const handleDelete = async (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this event type!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#E93939",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await _axios("delete", `/EventType/deleteEventType/${row.id}`);
          if (response.status === 200) {
            getData();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <DataTable
            title="Event Type"
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
        </div>
      )}
    </>
  );
};

export default Index;
