import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import React, { useEffect } from "react";
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
const label = { inputProps: { "aria-label": "Checkbox demo" } };

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
];
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
  );
}

EnhancedTableToolbar.propTypes = {
  title: PropTypes.string,
};
const AddUpdateDialog = ({ open, onClose, onEdit, onRefresh, row, menus }) => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [permissions, setPermissions] = React.useState([]);
  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState(false);

  useEffect(() => {
    console.log(row, onEdit);
    if (row && onEdit) {
    }
  }, [onEdit, row]);
  useEffect(() => {
    if (menus.length) {
      setPermissions(
        menus.map((x) => ({
          menuId: x.id,
          read: false,
          write: false,
          edit: false,
          delete: false,
          menu: x.name,
        })),
      );
    }
  }, [menus]);
  useEffect(() => {
    console.log(permissions);
  }, [permissions]);

  const handleSubmit = () => {
    if (!name) {
      setNameError(true);
      return;
    }
    const values = {
      roleName: name,
      permissions,
    };
    if (row && onEdit) {
      values.id = row.id;
      handleUpdate(values);
    } else {
      handleSave(values);
    }
  };
  const handleSave = async (values) => {
    try {
      const response = await _axios("post", `/Role/createRole`, values);
      if (response.status === 200) {
        toast.success("Role Added Successfully");
        onRefresh();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleUpdate = async (values) => {
    try {
      const response = await _axios("put", `/Role/updateRole/${values.id}`, values);
      if (response.status === 200) {
        toast.success("Role Updated Successfully");
        onRefresh();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        fullWidth
        hideBackdrop
      >
        <DialogTitle>{onEdit ? "Update Menu" : "Add Menu"}</DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%", p: 2 }}>
            <TextField
              fullWidth
              label="Role Name"
              sx={{ mb: 3 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
            />

            <Paper sx={{ width: "100%", mb: 2 }}>
              <EnhancedTableToolbar title="Menu Permission" />
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
                    {permissions.map((row, index) => (
                      <TableRow hover tabIndex={-1} key={row.name} sx={{ cursor: "pointer" }}>
                        <TableCell>{row.menu}</TableCell>
                        <TableCell>
                          <Checkbox
                            {...label}
                            checked={row.read}
                            onChange={(e) => {
                              const newPermissions = [...permissions];
                              newPermissions[index].read = e.target.checked;
                              setPermissions(newPermissions);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            {...label}
                            checked={row.write}
                            onChange={(e) => {
                              const newPermissions = [...permissions];
                              newPermissions[index].write = e.target.checked;
                              setPermissions(newPermissions);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            {...label}
                            checked={row.edit}
                            onChange={(e) => {
                              const newPermissions = [...permissions];
                              newPermissions[index].edit = e.target.checked;
                              setPermissions(newPermissions);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            {...label}
                            checked={row.delete}
                            onChange={(e) => {
                              const newPermissions = [...permissions];
                              newPermissions[index].delete = e.target.checked;
                              setPermissions(newPermissions);
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
        </DialogContent>
        <DialogActions>
          <CloseButton onClick={handleClose}>Cancel</CloseButton>
          <SubmitButton
            onClick={() => {
              console.log("clicked");
              handleSubmit();
            }}
          >
            {onEdit ? "Update" : "Add"}
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AddUpdateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onEdit: PropTypes.bool,
  onRefresh: PropTypes.func,
  row: PropTypes.object,
  menus: PropTypes.array,
};

export default AddUpdateDialog;
