import React from "react";

import DatePicker from "react-datepicker";
import { InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import moment from "moment";

function CustomDatePicker(props) {
  return (
    <>
      <InputLabel
        htmlFor="dob"
        sx={{
          display: "block",
          fontSize: "0.9rem",
          lineHeight: "1.5",
          marginBottom: "5px",
          color: "var(--color-gray-2)",
          fontWeight: "400",
        }}
      >
        D.O.B
      </InputLabel>
      <DatePicker
        {...props}
        selected={props.value}
        onChangeRaw={(e) => {
          props?.setFieldTouched(props.name, true, true);
        }}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        dateFormat="yyyy-MM-dd"
        maxDate={moment().toDate()}
        customInput={
          <OutlinedInput
            label=""
            inputProps={{
              style: { padding: "11px", fontSize: "0.9rem" },
            }}
            sx={{ paddingLeft: "6px" }}
            endAdornment={
              <InputAdornment position="end">
                <CalendarTodayIcon
                  sx={{ color: "#333333", fontSize: "18px", cursor: "pointer" }}
                />
              </InputAdornment>
            }
          />
        }
      />
    </>
  );
}

export default CustomDatePicker;
