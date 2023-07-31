import React from "react";

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
    ],
  },
  {
    id: "name",
    type: "text",
    label: "Name",
  },
  {
    id: "type",
    type: "chip",
    label: "Type",
    trueClass: "bg-green-500 text-white",
    falseClass: "bg-red-500 text-white",
  },
];
const Activity = () => {
  return <div>Activity</div>;
};

export default Activity;
