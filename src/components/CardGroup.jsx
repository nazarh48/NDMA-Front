import React from "react";
import Card from "./Card";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NoData from "./NoData";

const CardGroup = ({ title, data, onActionBtnClicked, filterParam }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  let filteredData = data.filter((row) =>
    row[filterParam].toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <>
      <Box sx={{ width: "100%" }}>
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
      </Box>
      {data.length ? (
        <div className="grid  gap-2 grid-cols-4">
          {filteredData.map((x) => (
            <div>
              <Card
                item={x}
                onOptionClicked={(action) => {
                  onActionBtnClicked(action, x);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <NoData />
      )}
    </>
  );
};

CardGroup.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onActionBtnClicked: PropTypes.func,
  filterParam: PropTypes.string.isRequired,
};
export default CardGroup;
