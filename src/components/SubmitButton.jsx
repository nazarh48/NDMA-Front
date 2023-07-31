import React from "react";

const SubmitButton = ({ children, onClick }) => {
  return (
    <>
      <button
        className="px-6 py-2 bg-black rounded-lg text-white text-sm        "
        type="submit"
        onClick={() => {
          onClick();
        }}
      >
        {children}
      </button>
    </>
  );
};

export default SubmitButton;
