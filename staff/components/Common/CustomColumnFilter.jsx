import React from "react";

function CustomColumnFilter(props, ref) {
  const { placeholder } = props;
  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      style={{
        height: "47px",
        padding: "16px",
        ...props.CustomColumnFilterStyles,
      }}
    />
  );
}

export default React.forwardRef(CustomColumnFilter);
