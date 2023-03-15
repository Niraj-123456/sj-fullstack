import React from "react";
import { useRouter } from "next/router";
import styles from "./successmodal.module.css";

import { staffBasePath } from "../../../utils/apiRoutes";

import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function SuccessModal({ open, handleModalClose, message, buttonLabel }) {
  const router = useRouter();
  const handleRedirectToLogin = () => {
    handleModalClose();
    router.push(`${staffBasePath}/login`);
  };
  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
      sx={{ zIndex: "99999" }}
    >
      <div className={styles.modal__container}>
        <div
          style={{
            display: "flex",
            flex: "1 1 0",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <FontAwesomeIcon
            icon={faClose}
            style={{
              fontSize: "24px",
              color: "var(--color-gray-2)",
              cursor: "pointer",
            }}
            onClick={handleModalClose}
          />
        </div>
        <h1 id="child-modal-title">Thank You!!!</h1>
        <p id="child-modal-description">{message}</p>
        <button onClick={handleRedirectToLogin}>{buttonLabel}</button>
      </div>
    </Modal>
  );
}

export default SuccessModal;
