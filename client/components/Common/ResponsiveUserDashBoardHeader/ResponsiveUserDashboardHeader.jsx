import React, { useState } from "react";
import styles from "./responsiveuserdashboardheader.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";

function ResponsiveUserDashboardHeader({ title, handleSideBarOpen }) {
  return (
    <div className={styles.responsive__header}>
      <div className={styles.hamburger__menu}>
        <FontAwesomeIcon
          icon={faBars}
          style={{
            padding: "7px 10px",
            color: "#03053D",
            borderRadius: "2px",
            fontSize: "1.5rem",
          }}
          onClick={handleSideBarOpen}
        />
      </div>
      <h1>{title}</h1>
      <FontAwesomeIcon icon={faSearch} style={{ padding: "7px 10px" }} />
    </div>
  );
}

export default ResponsiveUserDashboardHeader;
