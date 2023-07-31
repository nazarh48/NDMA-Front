import React, { useEffect } from "react";
import { toast } from "react-toastify";
import _axios from "./Axios";

const ActivityCard = (prop) => {
  return (
    <>
      <div className="max-w-sm px-6 py-8 bg-white border border-gray-200 rounded-lg shadow   ">
        <div className="flex flex-row gap-3 items-center ">
          <i className={`${prop.class} text-gray-500 text-3xl`}></i>
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-600  ">
            {prop.label}
          </h5>
        </div>
        <div className="text-gray-600 text-lg font-semibold mt-3  text-left     rounded-xl ">
          {prop.count}
        </div>
        {/* <p className="mb-3 font-normal text-gray-500">2410</p> */}
      </div>
    </>
  );
};

export default ActivityCard;
