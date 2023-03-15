import React from "react";
import styled from "@emotion/styled";

function TextArea({ field, label, ...props }) {
  return (
    <Input>
      {label && (
        <Label htmlFor={props.id} className={props.textarea__label}>
          {label}
        </Label>
      )}
      <textarea {...field} {...props} className={props.textarea}></textarea>
    </Input>
  );
}

export default TextArea;

const Input = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  textarea {
    border-radius: 3px;
    border: 1px solid #dbdbdb;
    width: 100%;
    height: 136px;
    padding: 11px 16px;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.02em;
    resize: none;
    &:hover {
      border: 1px solid var(--color-black);
    }
    &:focus {
      outline: 2px solid var(--color-black);
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.02em;
  color: var(--color-black-2);
`;
