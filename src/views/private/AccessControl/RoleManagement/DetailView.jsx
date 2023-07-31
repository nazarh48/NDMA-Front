import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _axios from "../../../../components/Axios";
import CloseButton from "../../../../components/CloseButton";
import SubmitButton from "../../../../components/SubmitButton";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import FormControl from "@mui/material/FormControl";
import { useLocation, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Loader from "../../../../components/Loader";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const rows = [];
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,

    label: "Menu",
  },
  {
    id: "read",
    numeric: false,

    label: "Read",
  },
  {
    id: "write",
    numeric: false,

    label: "Write",
  },
  {
    id: "edit",
    numeric: false,

    label: "Edit",
  },
  {
    id: "delete",
    numeric: false,

    label: "Delete",
  },
];
function TableHeader(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow hover>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: "bold",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableHeader.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
function EnhancedTableToolbar(props) {
  const { title } = props;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
        </Toolbar>
        <Box
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={props.selected}
                onChange={(e) => {
                  props.onSelectedChange(e.target.checked);
                }}
              />
            }
            label="Select All"
          />
        </Box>
      </Box>
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  title: PropTypes.string,
  selected: PropTypes.bool,
  onSelectedChange: PropTypes.func,
};
const DetailView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [permissions, setPermissions] = useState([]);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [menus, setMenus] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [menusWithPermissions, setMenusWithPermissions] = useState([]);
  const { id } = useParams();
  const route = useLocation();
  useEffect(() => {
    if (route.pathname.includes("add")) {
      getMenus();
    } else {
      setOnEdit(true);
      getMenus();
      getRoleInfoById();
    }
  }, []);
  useEffect(() => {
    if (permissions.length) {
      const isAllSelected = permissions.every((x) => x.read && x.write && x.edit && x.delete);
      setIsAllSelected(isAllSelected);
    }
  }, [permissions]);
  const getRoleInfoById = async () => {
    try {
      if (!id) return;
      setIsLoading(true);

      const response = await _axios("get", "/Role/getRoleInfoById/" + id, null);
      if (response.status == 200) {
        console.log(response.data.data);
        setName(response.data.data.name);
        setPermissions(response.data.data.rolePermissions || []);
      }
    } catch (err) {
      toast.error(err.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getMenus = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Menu/getMenus`);
      if (response.status === 200) {
        console.log(response.data.data);
        setMenus(response.data.data);
        setPermissions(
          response.data.data.map((x) => ({
            menuId: x.id,
            read: true,
            write: true,
            edit: true,
            delete: true,
            menu: x.name,
          })),
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(permissions);
    if (permissions.length && menus.length) {
      const menuWithPermissions = menus.map((menu) => {
        const permission = permissions.find((p) => p.menuId === menu.id);

        if (permission) {
          return {
            ...menu,
            read: permission.read,
            write: permission.write,
            edit: permission.edit,
            delete: permission.delete,
          };
        } else {
          return {
            ...menu,
            read: false,
            write: false,
            edit: false,
            delete: false,
          };
        }
      });
      setMenusWithPermissions(menuWithPermissions);
    }
  }, [permissions]);

  const handleSubmit = () => {
    if (!name) {
      setNameError(true);
      return;
    } else {
      setNameError(false);
    }
    const values = {
      roleName: name,
      permissions: menusWithPermissions.map((x) => ({
        menuId: x.id,
        read: x.read,
        write: x.write,
        edit: x.edit,
        delete: x.delete,
      })),
    };
    if (onEdit) {
      handleUpdate(values);
    } else {
      handleSave(values);
    }
  };
  const handleSave = async (values) => {
    setIsLoading(true);
    try {
      const response = await _axios("post", `/Role/createRole`, values);
      if (response.status === 200) {
        toast.success("Role Added Successfully");
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdate = async (values) => {
    setIsLoading(true);

    try {
      const response = await _axios("put", `/Role/updateRole/${id}`, values);
      if (response.status === 200) {
        toast.success("Role Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 50));
    setPage(0);
  };
  const handleOnAllSelectChange = (e) => {
    if (e) {
      const _permissions = [...menusWithPermissions];
      _permissions.forEach((x) => {
        x.read = true;
        x.write = true;
        x.edit = true;
        x.delete = true;
      });
      setMenusWithPermissions(_permissions);
      setIsAllSelected(true);
    } else {
      const _permissions = [...menusWithPermissions];
      _permissions.forEach((x) => {
        x.read = false;
        x.write = false;
        x.edit = false;
        x.delete = false;
      });
      setMenusWithPermissions(_permissions);
      setIsAllSelected(false);
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <div>
      {isLoading && <Loader />}
      <Box sx={{ width: "100%", p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={11} sm={11} md={11}>
            <TextField
              fullWidth
              label="Role Name"
              sx={{ mb: 3 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
            />
          </Grid>
          <Grid item xs={1} md={1}>
            {" "}
            <SubmitButton
              onClick={() => {
                console.log("clicked");
                handleSubmit();
              }}
            >
              {onEdit ? "Update" : "Save"}
            </SubmitButton>
          </Grid>
        </Grid>

        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            title="Menu Permission"
            selected={isAllSelected}
            onSelectedChange={(e) => {
              handleOnAllSelectChange(e);
            }}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"small"}>
              <TableHeader
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {menusWithPermissions.map((row, index) => (
                  <TableRow hover tabIndex={-1} key={row.name} sx={{ cursor: "pointer" }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        {...label}
                        checked={row.read}
                        onChange={(e) => {
                          const newPermissions = [...menusWithPermissions];
                          newPermissions[index].read = e.target.checked;
                          setMenusWithPermissions(newPermissions);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        {...label}
                        checked={row.write}
                        onChange={(e) => {
                          const newPermissions = [...menusWithPermissions];
                          newPermissions[index].write = e.target.checked;
                          setMenusWithPermissions(newPermissions);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        {...label}
                        checked={row.edit}
                        onChange={(e) => {
                          const newPermissions = [...menusWithPermissions];
                          newPermissions[index].edit = e.target.checked;
                          setMenusWithPermissions(newPermissions);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        {...label}
                        checked={row.delete}
                        onChange={(e) => {
                          const newPermissions = [...menusWithPermissions];
                          newPermissions[index].delete = e.target.checked;
                          setMenusWithPermissions(newPermissions);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={permissions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </div>
  );
};

export default DetailView;
