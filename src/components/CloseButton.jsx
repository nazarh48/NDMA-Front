import React from "react";

const CloseButton = ({ children, onClick }) => {
  return (
    <>
      <button
        className="px-6 py-2 bg-gray-200 rounded-lg text-black text-sm  hover:bg-gray-200 transition-colors hover:border-gray-300 w-auto "
        onClick={() => {
          onClick();
        }}
      >
        {children}
      </button>
    </>
  );
};

export default CloseButton;
