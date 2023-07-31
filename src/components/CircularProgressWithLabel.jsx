import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";
import PropTypes from "prop-types";

const CircularProgressWithLabel = ({ value }) => {
  const circumference = 30 * 2 * Math.PI;
  const percent = 80;
  console.log(value);
  return (
    <div
      x-data="scrollProgress"
      className="relative inline-flex items-center justify-center overflow-hidden rounded-full "
    >
      <svg className="w-20 h-20">
        <circle
          className="text-gray-300"
          stroke-width="5"
          stroke="currentColor"
          fill="transparent"
          r="30"
          cx="40"
          cy="40"
        />
        <circle
          className="text-blue-600"
          stroke-width="5"
          stroke-dasharray={circumference}
          stroke-dashoffset={circumference - (value / 100) * circumference}
          stroke-linecap="round"
          stroke="currentColor"
          fill="transparent"
          r="30"
          cx="40"
          cy="40"
        />
      </svg>
      <span className="absolute text-sm text-blue-700 ">{value}%</span>
    </div>
  );
};

export default CircularProgressWithLabel;
