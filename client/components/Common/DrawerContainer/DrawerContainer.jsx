import React from "react";
import styles from "./drawercontainer.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Drawer } from "@mui/material";

function DrawerContainer({ heading, anchor, open, onClose, children }) {
  return (
    <Drawer anchor={anchor} open={open} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1>{heading}</h1>
            <FontAwesomeIcon
              icon={faXmark}
              onClick={onClose}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles.new__booking__form}>{children}</div>
        </div>
      </div>
    </Drawer>
  );
}

export default DrawerContainer;
