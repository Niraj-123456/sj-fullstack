import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";

import InputField from "./InputField";

function CustomDateFilter({
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
  placeholder1,
  placeholder2,
  containerStyles,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        ...containerStyles,
      }}
    >
      <div style={{ position: "relative" }}>
        <DatePicker
          selected={startDate}
          onChange={(date) => handleStartDateChange(date)}
          placeholderText={placeholder1}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          // minDate={moment(startDate).toDate()}
          customInput={
            <InputField
              style={{ width: "130px", height: "48px", marginTop: "5px" }}
            />
          }
        />

        <FontAwesomeIcon
          icon={faCalendar}
          style={{
            fontSize: "18px",
            position: "absolute",
            top: "50%",
            right: "5%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div style={{ position: "relative" }}>
        <DatePicker
          selected={endDate}
          placeholderText={placeholder2}
          onChange={(date) => handleEndDateChange(date)}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          maxDate={moment().toDate()}
          customInput={
            <InputField
              style={{ width: "130px", height: "48px", marginTop: "5px" }}
            />
          }
        />

        <FontAwesomeIcon
          icon={faCalendar}
          style={{
            fontSize: "18px",
            position: "absolute",
            top: "50%",
            right: "5%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
}

export default CustomDateFilter;
