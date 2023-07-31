import React, { useEffect } from "react";
import _axios from "../../../../components/Axios";
import DataTable from "../../../../components/DataTable";

import Swal from "sweetalert2";
import Dialog from "./Dialog";
import Loader from "../../../../components/Loader";

export const columns = [
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
    id: "city",
    type: "text",
    label: "City",
  },
  {
    id: "occupiedInventory",
    type: "text",
    label: "Occupied Inventory",
  },
  {
    id: "refillThreshold",
    type: "text",
    label: "Refill Threshold",
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
];

const index = () => {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState({});
  const [onEdit, setOnEdit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await _axios("get", `/Warehouse/getWarehouses`);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
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
    console.log(row);
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this warehouse and relevant inventory data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#E93939",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await _axios("delete", `/Warehouse/deleteWarehouse/${row.id}`);
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
    <div>
      {isLoading && <Loader />}
      <DataTable
        title="Warehouses"
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
  );
};

export default index;
