import React from "react";

function CustomColumnFilter(props) {
  const { value, placeholder, onChange, list } = props;
  return (
    <input
      type="text"
      onChange={onChange}
      placeholder={placeholder}
      style={{
        height: "47px",
        padding: "16px",
        ...props.CustomColumnFilterStyles,
      }}
    />
  );
}

export default CustomColumnFilter;
