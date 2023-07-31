import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import TableFooter from "@mui/material/TableFooter";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MiniTable from "./MiniTable";
const options = [
  {
    label: "Edit",
    icon: (
      <i className="fa-solid fa-pen-to-square  text-gray-500 text-xl cursor-pointer hover:text-gray-600"></i>
    ),
    action: "edit",
  },
  {
    label: "Delete",
    icon: (
      <i className="fa-solid fa-trash text-red-500 text-xl cursor-pointer hover:text-red-600"></i>
    ),
    action: "delete",
  },
];

const ITEM_HEIGHT = 48;

const ActionMenu = ({ onOptionClicked }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClicked = (option) => {
    onOptionClicked(option.action);
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              handleOptionClicked(option);
            }}
          >
            <div className="flex gap-2">
              <span>{option.label}</span>
              <span>{option.icon}</span>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const columns = [
  { id: "inventoryType", label: "Type" },
  { id: "inventoryQuantity", label: "Quantity" },
  {
    id: "weightPerItem",
    label: "Weight",
  },
];

const Card = ({ item, onOptionClicked }) => {
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow  ">
      <div className="flex justify-between items-center">
        <i className="fa-solid fa-truck-moving  text-2xl mb-2 text-gray-500 "></i>

        <ActionMenu
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onOptionClicked={(action) => {
            onOptionClicked(action);
          }}
        />
      </div>
      <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 ">
          {item.warehouse}
        </h5>
      </a>

      <MiniTable item={item} columns={columns} rowPerPage={1} />
    </div>
  );
};
Card.propTypes = {
  item: PropTypes.object,
};

export default Card;
