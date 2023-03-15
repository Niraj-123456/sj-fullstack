import React from "react";
import styled from "@emotion/styled";

function FormButton(props) {
  return (
    <Button {...props} disabled={props.disabled}>
      {props.icon && props.icon}
      {props.label}
    </Button>
  );
}

export default FormButton;

const Button = styled.button`
  padding-inline: 20px;
  height: 46px;
  background: var(--color-blue-2);
  border-radius: 5px;
  outline: none;
  border: 0;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;

  :disabled {
    background: var(--color-blue-4);
    cursor: not-allowed;
  }
`;
