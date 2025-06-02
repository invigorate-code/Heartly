"use client";

import React from "react";
import { Spinner } from "@heroui/react";

const LoadingOverlay = () => {
  return (
    <div style={styles.overlay as React.CSSProperties}>
      <Spinner color="primary" size="lg" />
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
};

export default LoadingOverlay;
