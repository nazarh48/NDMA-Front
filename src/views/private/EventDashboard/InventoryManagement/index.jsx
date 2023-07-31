import React, { useEffect } from "react";
import _axios from "../../../../components/Axios";
import DataTable from "../../../../components/DataTable";

import Swal from "sweetalert2";
import Dialog from "./Dialog";
import Card from "../../../../components/Card";
import CardGroup from "../../../../components/CardGroup";
import Loader from "../../../../components/Loader";

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
    id: "warehouse",
    type: "text",
    label: "Warehouse",
  },

  {
    id: "inventory",
    type: "array",
    label: "Inventory",
    propertiesToShow: [
      {
        label: "inventoryType",
        type: "text",
      },
      {
        label: "inventoryQuantity",
        type: "text",
      },
    ],
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
      const response = await _axios("get", `/Inventory/getInventory`);
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
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this inventory!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#E93939",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await _axios("delete", `/Inventory/deleteInventory/${row.warehouseId}`);
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

      <CardGroup
        data={data}
        title="Inventory"
        onActionBtnClicked={(event, row) => {
          console.log(event, row);
          handleActionEvents(event, row);
        }}
        filterParam={"warehouse"}
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
