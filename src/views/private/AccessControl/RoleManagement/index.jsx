import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import _axios from "../../../../components/Axios";
import DataTable from "../../../../components/DataTable";
import Loader from "../../../../components/Loader";
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
        className: "fa-solid fa-info  text-gray-500 text-xl cursor-pointer  hover:text-gray-600",
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
];

const index = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState({});
  const [onEdit, setOnEdit] = React.useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Role/getRoles`);
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
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this role. It might affect inconsistency in permissions",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#E93939",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const response = await _axios("delete", `/Role/deleteRole/${id}`);
          if (response.status === 200) {
            toast.success("Role deleted successfully");
            getData();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleActionEvents = (event, row) => {
    console.log(event, row);
    if (event === "add") {
      console.log("add");
      navigate("/access-control/add-role");
    }
    if (event === "edit") {
      setOnEdit(true);
      setRow(row);
      setOpen(true);
    }
    if (event == "detail") {
      navigate("/access-control/role-detail-view/" + row.id);
    }
    if (event === "delete") {
      handleDelete(row.id);
    }
  };
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            title="Role"
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
          />
        </>
      )}
    </div>
  );
};

export default index;
