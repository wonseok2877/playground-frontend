import React from "react";

const LargeText = (props) => {
  return (
    <div
      className="text-7xl mb-3"
      style={{ fontFamily: "Do Hyeon, sans-serif" }}
    >
      {props.children}
    </div>
  );
};

export default LargeText;
