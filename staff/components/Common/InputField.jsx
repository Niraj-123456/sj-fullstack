import React, { forwardRef } from "react";
import styled from "@emotion/styled";

function InputField({ field, label, ...props }, ref) {
  return (
    <InputContainer>
      {label && (
        <Label htmlFor={props.id} style={props.labelstyles}>
          {label}
        </Label>
      )}
      <input ref={ref} type="text" {...field} {...props} />
    </InputContainer>
  );
}

export default forwardRef(InputField);

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  input {
    width: 375px;
    font-size: 1rem;
    border-radius: 3px;
    padding-block: 13px;
    padding-left: 16px;
    padding-right: 37px;
    border: 1px solid #dbdbdb;

    &::placeholder {
      color: var(--color-gray-3);
    }

    &:focus:not(hover) {
      outline: 2px solid #333333;
    }
    &:hover {
      outline: 1px solid #333333;
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  line-height: 1.5;
  letter-spacing: 0.02em;
`;
