import React, { useMemo } from "react";
import styles from "./otpinput.module.css";

const RE_DIGIT = new RegExp(/^\d+$/);

function OtpInput({ id, name, value, valueLength, onChange, onBlur }) {
  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items = [];

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) items.push(char);
      else items.push("");
    }
    return items;
  }, [value, valueLength]);

  // focus to the next input element
  const focusToNextInput = (target) => {
    const nextElementSibling = target.nextElementSibling;

    if (nextElementSibling) nextElementSibling.focus();
  };

  // focus to the previous input element
  const focusToPrevInput = (target) => {
    const previousElementSibling = target.previousElementSibling;

    if (previousElementSibling) previousElementSibling.focus();
  };

  const inputOnChange = (e, idx) => {
    const target = e.target;
    let targetValue = e.target.value;
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== "") return;

    const nextInputEl = target.nextElementSibling;

    // only delete digit if next element has no value
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") return;

    targetValue = isTargetValueDigit ? targetValue : " ";

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1);

      onChange(newValue);

      if (!isTargetValueDigit) return;

      focusToNextInput(target);
    } else if (targetValueLength === valueLength) {
      onChange(targetValue);
      // if (targetValue)
      // target.blur();
    }
  };

  const inputOnKeyDown = (e) => {
    const { key } = e;
    const target = e.target;
    const targetValue = target.value;

    // focus to the next input element if the key pressed is right or down
    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }

    // focus the previous input element if the key pressed is left or up
    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length);

    if (key !== "Backspace" || targetValue !== "") return;

    focusToPrevInput(target);
  };

  const inputOnFocus = (e) => {
    const { target } = e;

    // keep focusing back until previous
    // element has value
    const prevInputEl = target.previousElementSibling;

    if (prevInputEl && prevInputEl.value === "") return prevInputEl.focus();

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, target.value.length);
  };
  return (
    <div className={styles.container}>
      {valueItems.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          id={id}
          name={name}
          value={digit}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={valueLength}
          onChange={(e) => inputOnChange(e, idx)}
          onBlur={onBlur}
          onKeyDown={inputOnKeyDown}
          onFocus={inputOnFocus}
          className={styles.otp__input}
        />
      ))}
    </div>
  );
}

export default OtpInput;
