import React, { useState } from "react";
import styles from "./refercodeform.module.css";

import { useDispatch } from "react-redux";

import InputField from "../Common/InputField";
import { checkReferralToken } from "../https/registerServices";
import {
  storeReferralCode,
  clearReferralCode,
} from "../../redux/features/referralCode/referralCodeSlice";

function ReferCodeForm(props) {
  const { name, id, value, setFieldValue, handleChange, handleBlur } = props;
  const dispatch = useDispatch();
  const [serverResponse, setServerResponse] = useState({
    success: "",
    error: "",
  });
  const [showUnapplyButton, setShowUnapplyButton] = useState(false);

  const handleReferralCheck = async () => {
    setServerResponse("");
    try {
      const { data } = await checkReferralToken(value);
      console.log(data);
      if (data.success) {
        dispatch(storeReferralCode(value));
        setServerResponse({ serverResponse, success: data.message });
        setShowUnapplyButton(true);
      }
    } catch (ex) {
      const errorMsg = ex.response.data.message;
      console.log(errorMsg);
      setServerResponse({ serverResponse, error: errorMsg });
    }
  };

  const handleUnapplyCode = () => {
    setShowUnapplyButton(false);
    setServerResponse("");
    setFieldValue(name, "");
    dispatch(clearReferralCode(null));
  };

  return (
    <>
      <div className={styles.referral__code}>
        <div>
          <InputField
            label="Refer Code"
            name={name}
            id={id}
            value={value}
            type="text"
            placeholder="Enter code here"
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ fontSize: "0.9rem", width: "100%" }}
            labelstyle={styles.label__style}
            disabled={showUnapplyButton}
          />
        </div>

        {!showUnapplyButton ? (
          <button
            disabled={value === "" || value === null || value === undefined}
            type="button"
            onClick={handleReferralCheck}
          >
            Apply Code
          </button>
        ) : (
          <button type="button" onClick={handleUnapplyCode}>
            UnApply Code
          </button>
        )}
      </div>
      {serverResponse.success && (
        <div className="success__message">{serverResponse.success}</div>
      )}
      {serverResponse.error && (
        <div className="error__message">{serverResponse.error}</div>
      )}
    </>
  );
}

export default ReferCodeForm;
