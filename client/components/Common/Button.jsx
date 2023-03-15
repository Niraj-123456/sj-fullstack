import React from "react";
import styled from "@emotion/styled";

function Button(props) {
  return (
    <SubmitButton disabled={props.disabled} {...props}>
      {props.label}
    </SubmitButton>
  );
}

export default Button;

const SubmitButton = styled.button`
  padding-inline: 20px;
  height: 46px;
  background: #f58634;
  border-radius: 5px;
  outline: none;
  border: 0;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;

  :disabled {
    background: #f9a8d4;
  }
`;
