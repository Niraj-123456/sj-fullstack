import React from "react";

import Select from "react-select";

function SelectField(props) {
  const { options, value, isMulti } = props;

  const customStyles = {
    container: (prev) => ({
      ...prev,
      ...props.containerStyles,
      width: "100%",
    }),
    control: (prev, state) => ({
      ...prev,
      ...props.controlStyles,
      paddingLeft: "8px",
      border: "1px solid white",
      outline: state.isFocused
        ? "solid 2px var(--color-black)"
        : "solid 1px #dbdbdb",
      borderRadius: "3px",
      "&:hover": {
        borderColor: "var(--color-black) !important",
      },
    }),
    groupHeading: (prev) => ({
      ...prev,
      paddingBlock: "5px",
      fontSize: "1rem",
      letterSpacing: "0.02em",
      textTransform: "capitalize",
    }),
    indicatorSeparator: (prev) => ({
      ...prev,
      display: "none",
    }),
    dropdownIndicator: (prev) => ({
      ...prev,
      ...props.dropdownIndicatorStyles,
      paddingInline: "15px",
      cursor: "pointer",
    }),
    singleValue: (prev) => ({
      ...prev,
      ...props.singleValueStyles,
      textAlign: "left",
    }),
    option: (prev) => ({
      ...prev,
      ...props.optionStyles,
      textAlign: "left",
    }),
    input: (prev) => ({
      ...prev,
      ...props.inputStyles,
    }),
    placeholder: (prev) => ({
      ...prev,
      color: "var(--color-gray-3)",
      letterSpacing: "0.02em",
    }),
  };

  const defaultValue = () => {
    if (options) {
      return isMulti
        ? options
            .map((option) => option?.options)[0]
            .filter((option) => value.indexOf(option.id) >= 0)
        : options.find((option) => option.value === value) || "";
    } else {
      return isMulti ? [] : "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {props.label && (
        <div
          style={{
            ...props.labelStyles,
            fontSize: "0.9rem",
            lineHeight: "1.5",
            marginBottom: "5px",
          }}
        >
          {props.label}
        </div>
      )}
      <Select
        {...props}
        value={defaultValue() || props.defaultValue}
        styles={customStyles}
        maxMenuHeight="150px"
      />
    </div>
  );
}

export default React.memo(SelectField);
