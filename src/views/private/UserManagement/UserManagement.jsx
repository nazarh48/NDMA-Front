import { IconArrowBackUp } from "@tabler/icons";
import React from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import _axios from "../../../components/Axios";
import { AddUpdateDialog } from "./AddUpdateDialog";
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
import Button from "@mui/material/Button";

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

// with exampleArray.slice().sort(exampleComparator)
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
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },

  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: true,
    label: "Email",
  },
  {
    id: "isAdmin",
    numeric: false,
    disablePadding: true,
    label: "Role",
  },
  {
    id: "department",
    numeric: false,
    disablePadding: true,
    label: "Department",
  },
  {
    id: "createdBy",
    numeric: false,
    disablePadding: true,
    label: "Created By",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "isActive",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
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

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", fontWeight: "bold" }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          Users
        </Typography>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const UserManagement = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  useEffect(() => {
    getUsers();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length || 0) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

  const getUsers = async () => {
    try {
      const response = await _axios("get", "UserManagement/getUsers", null);

      if (response.status == 200) {
        setData(response.data.data);
        setSortedData(response.data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this user!",
        icon: "warning",
        showCancelButton: true,
      }).then(async (isConfirmed) => {
        if (isConfirmed.isConfirmed) {
          const response = await _axios("delete", `UserManagement/deleteUser/${id}`, null);

          if (response.status == 200) {
            toast.success(response.data.message);
            getUsers();
          }
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBlock = async (id) => {
    try {
      const response = await _axios("put", `UserManagement/toggleActiveStatus/${id}`, null);
      if (response.status == 200) {
        toast.success(response.data.message);
        getUsers();
      }
    } catch (error) {
      toast.error(error.message?.data?.message);
    }
  };
  return (
    <>
      <div className="customer_container">
        <div className="flex justify-end gap-2">
          <AddUpdateDialog
            onEdit={onEdit}
            onDelete={onDelete}
            row={currentRow}
            onDialogClose={() => {
              setCurrentRow(null);
              setOnDelete(false);
              setOnEdit(false);
            }}
            getUsers={getUsers}
          />
        </div>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data?.length || 0}
              />
              <TableBody>
                {data?.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name + index}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="center">
                        <div className="flex gap-1 justify-center">
                          <i
                            className="fa-solid fa-trash text-red-500 text-xl cursor-pointer hover:text-red-600"
                            onClick={() => {
                              setCurrentRow(row);
                              handleDelete(row.id);
                            }}
                          ></i>

                          <i
                            className="fa-solid fa-pen-to-square  text-gray-500 text-xl cursor-pointer hover:text-gray-600"
                            onClick={() => {
                              setCurrentRow(row);
                              setOnEdit(true);
                            }}
                          ></i>
                          <>
                            {row?.isActive && (
                              <i
                                className="fa-solid fa-user text-black text-xl cursor-pointer hover:text-zinc-700"
                                onClick={(e) => {
                                  handleBlock(row.id);
                                }}
                              ></i>
                            )}
                            {!row?.isActive && (
                              <i
                                class="fa-solid fa-user-slash text-black text-xl cursor-pointer hover:text-zinc-700"
                                onClick={(e) => {
                                  handleBlock(row.id);
                                }}
                              ></i>
                            )}
                          </>
                        </div>
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">
                        {row?.isAdmin && (
                          <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-lg">
                            Admin
                          </span>
                        )}
                        {!row?.isAdmin && (
                          <span className="bg-zinc-500 text-white text-sm px-3 py-1 rounded-lg">
                            User
                          </span>
                        )}
                      </TableCell>
                      <TableCell align="center">{row?.department}</TableCell>
                      <TableCell align="center">{row.createdBy}</TableCell>
                      <TableCell align="center">
                        {new Date(row.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {row?.isActive && (
                          <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-lg">
                            Active
                          </span>
                        )}
                        {!row?.isActive && (
                          <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-lg">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            count={data?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </>
  );
};

export default UserManagement;
