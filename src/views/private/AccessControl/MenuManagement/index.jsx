import { RowingOutlined } from "@mui/icons-material";
import React from "react";
import Dialog from "./Dialog";
import DataTable from "../../../../components/DataTable";
import { toast } from "react-toastify";
import _axios from "../../../../components/Axios";
import { useEffect } from "react";
import Loader from "../../../../components/Loader";
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
    id: "url",
    type: "text",
    label: "URL",
  },
  {
    id: "position",
    type: "text",
    label: "Position",
  },
  {
    id: "icon",
    type: "icon",
    label: "Icon",
  },
  {
    id: "order",
    type: "text",
    label: "Order",
  },
  {
    id: "parentId",
    type: "text",
    label: "Parent",
  },
];

const index = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [menuPositions, setMenuPositions] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState({});
  const [onEdit, setOnEdit] = React.useState(false);

  useEffect(() => {
    getData();
    getMenuPositions();
  }, []);
  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Menu/getMenus`);
      if (response.status === 200) {
        console.log(response.data.data);
        setData(
          response.data.data.map(
            (item) =>
              ({
                id: item.id,
                name: item.name,
                parentId: item?.parent?.name,
                order: item.order,
                icon: item.icon,
                url: item.url,
                parent: item.parent,
                menuPosition: item.menuPosition,
                position: item?.menuPosition?.name,
              } || []),
          ),
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getMenuPositions = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/MenuPosition/getMenuPositions`);
      if (response.status === 200) {
        console.log(response.data.data);
        setMenuPositions(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteMenu = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#E93939",
      })
        .then(async (result) => {
          if (result.isConfirmed) {
            setIsLoading(true);
            const response = await _axios("delete", `/Menu/deleteMenu/${id}`);
            if (response.status === 200) {
              toast.success(response.data.message);
              getData();
            }
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
    if (event == "delete") {
      deleteMenu(row.id);
    }
  };
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            title="Menu"
            columns={columns}
            data={data}
            onActionBtnClicked={(event, row) => {
              handleActionEvents(event, row);
            }}
            filterParam={"name"}
          />
          <Dialog
            onRefresh={() => {
              getData();
            }}
            open={open}
            onEdit={onEdit}
            row={row}
            onClose={() => {
              setOpen(false);
              setOnEdit(false);
              setRow({});
            }}
            menus={data || []}
            menuPositions={menuPositions || []}
          />
        </>
      )}
    </div>
  );
};

export default index;
