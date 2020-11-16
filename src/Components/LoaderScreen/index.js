import React from "react";

import styles from "./styles.module.scss";

export const LoaderScreen = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderInnerContainer}>
        <div className={styles.overlay_container}>
          <img
            src={`${window.location.origin}/images/logo-black-svg.png`}
            style={{ width: "300px", marginBottom: "50px" }}
          />
        </div>
      </div>
    </div>
  );
};
