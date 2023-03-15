import React from "react";
import { InputBase } from "@mui/material";
import styled from "@emotion/styled";

function PhoneNumberInput({ field, label, ...props }) {
  return (
    <Container>
      {label ? (
        <Label htmlFor={props.id} style={props.labelstyles}>
          {label}
        </Label>
      ) : (
        ""
      )}
      <Input className={props.inputdiv} style={props.style}>
        <span
          style={{
            marginRight: "5px",
            color: "var(--color-gray-2)",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
          className={props.inputicon}
        >
          {props.icon}
        </span>

        <InputBase
          {...field}
          {...props}
          className={props.input}
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            width: "70%",
          }}
        />
      </Input>
    </Container>
  );
}

export default PhoneNumberInput;

const Container = styled.div`
  display: "flex";
  flexdirection: "column";
  gap: "5px";
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const Input = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: var(--color-black-2);
  background: #ffffff;
  border: 1px solid #cbcbcb;
  border-radius: 3px;
  width: 365px;
  height: 46px;
  padding-inline: 16px;
  margin-top: 8px;

  &:disabled {
    cursor: not-allowed;
  }

  &:hover {
    outline: solid 1px var(--color-black);
  }

  &:focus-within:not(hover) {
    outline: solid 2px var(--color-black) !important;
  }

  "@media (max-width: 414px)": {
    font-size: 8px;
  }
`;
