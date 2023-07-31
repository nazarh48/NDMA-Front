import * as React from "react";
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
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import NoData from "./NoData";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

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

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                fontWeight: "bold",
              }}
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columns: PropTypes.array.isRequired,
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

DataTable.prototype = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onActionBtnClicked: PropTypes.func,
  filterParam: PropTypes.string.isRequired,
  showSearch: PropTypes.bool,
  menus: PropTypes.array,
  onBtnClicked: PropTypes.func,
};
export default function DataTable({
  title,
  data,
  columns,
  onActionBtnClicked,
  filterParam,
  showSearch = true,
  onBtnClicked,
}) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [rowData, setRowData] = React.useState([]);

  let visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, data],
  );

  //this will be the data that will be displayed in the table

  let filteredData = visibleRows.filter((row) =>
    row[filterParam].toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pluralizeWord = (word) => {
    if (word.endsWith("y")) {
      word = word.slice(0, -1) + "ies"; // Change 'y' to 'ies' for plural
    } else {
      word = `${word}s`;
    }
    return word;
  };
  // Avoid a layout jump when reaching the last page with empty data.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      {showSearch && (
        <div className="flex  mb-2 gap-4 items-center justify-end">
          <button
            className="px-5 py-3 bg-gray-200 rounded-lg text-black text-sm  hover:bg-gray-200 transition-colors hover:border-gray-300 w-auto"
            onClick={() => {
              onActionBtnClicked("add");
            }}
          >
            Add {title}
          </button>
          <TextField
            id="filled-basic"
            label="Search..."
            variant="outlined"
            onInput={(e) => {
              setSearchQuery(e.target.value);
            }}
            sx={{
              width: "25%",
            }}
          />
        </div>
      )}
      {data.length ? (
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar title={pluralizeWord(title)} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" stickyHeader={true}>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
                columns={columns}
              />
              <TableBody key="data-table">
                {filteredData.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.name + index} sx={{ cursor: "pointer" }}>
                      {
                        //now conditionally render the row data. If property exists in column object, render it
                        columns.map((column, index) => {
                          if (column.type === "text" && row.hasOwnProperty(column.id)) {
                            return (
                              <TableCell key={`${row[column.id]}-${index}`}>
                                {row[column.id]}
                              </TableCell>
                            );
                          }
                          if (column.type === "actions") {
                            return (
                              <TableCell key={`${row[column.id]}-${index}`}>
                                <div className="flex gap-1">
                                  {column.actions.map((action) => {
                                    if (
                                      action.actionType === "normal" ||
                                      (action.actionType === "conditional" &&
                                        row[action.condition.split(":")[0]] ===
                                          action.condition.split(":")[1])
                                    ) {
                                      return (
                                        <Tooltip title={action.action} placement="top" arrow>
                                          <IconButton
                                            aria-label={action.action}
                                            size="small"
                                            onClick={() => {
                                              onActionBtnClicked(action.action, row);
                                            }}
                                          >
                                            <i className={action.className}></i>
                                          </IconButton>
                                        </Tooltip>
                                      );
                                    }
                                  })}
                                </div>
                              </TableCell>
                            );
                          }
                          if (column.type === "date" && row.hasOwnProperty(column.id)) {
                            return (
                              <TableCell key={`${row[column.id]}-${index}`}>
                                {new Date(row[column.id]).toLocaleDateString("en", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </TableCell>
                            );
                          }
                          if (column.type === "chip" && row.hasOwnProperty(column.id)) {
                            return (
                              <TableCell key={`${row[column.id]}-${index}`}>
                                <span
                                  className={`px-2 py-1 rounded-lg ${
                                    row[column.id] ? column.trueClass : column.falseClass
                                  }`}
                                >
                                  {row[column.id]}
                                </span>
                              </TableCell>
                            );
                          }
                          if (column.type === "color" && row.hasOwnProperty(column.id)) {
                            return (
                              <TableCell key={`${row[column.id]}-${index}`}>
                                <span
                                  className={`rounded-lg`}
                                  style={{
                                    backgroundColor: row[column.id],
                                    padding: "5px 26px",
                                  }}
                                ></span>
                              </TableCell>
                            );
                          }
                          if (column.type === "array" && row.hasOwnProperty(column.id)) {
                            return (
                              <TableCell key={`${row[column.id]}-${index}`}>
                                {column.type.propertiesToShow.map((property) => {
                                  return (
                                    <div>
                                      <span
                                        style={{
                                          backgroundColor: row[column.id],
                                          padding: "5px 26px",
                                        }}
                                      >
                                        {property.label}({row[column.id][property.label]})
                                      </span>
                                    </div>
                                  );
                                })}
                              </TableCell>
                            );
                          }
                          if (column.type === "progress-bar" && row.hasOwnProperty(column.id)) {
                            return (
                              <TableCell key={`${row[column.id]}-${index}`}>
                                <CircularProgressWithLabel value={row[column.id] || 0} />
                              </TableCell>
                            );
                          }
                          if (column.type === "button" && row.hasOwnProperty(column.id)) {
                            return (
                              <button
                                className="text-sm bg-gray-200 rounded-lg px-3 py-2 m-2"
                                onClick={() => {
                                  onBtnClicked(column.action, row);
                                }}
                              >
                                {console.log(column)}
                                {column.btnText}
                              </button>
                            );
                          }
                          if (column.type === "icon" && row.hasOwnProperty(column.id)) {
                            return (
                              <TableCell key={`${row[column.id]}-${index}`}>
                                <i className={`${row[column.id]} text-2xl`} />
                              </TableCell>
                            );
                          }
                          return null; // Return null for columns that don't exist in the row object
                        })
                      }
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <NoData />
      )}
    </Box>
  );
}
