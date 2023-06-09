import React from "react";
import styles from "./layout.module.css";

function Layout({ children }) {
  return <div className={styles.main}>{children}</div>;
}

export default Layout;
