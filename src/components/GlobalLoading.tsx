import React from "react";
import { Spin } from "antd";

const GlobalLoading: React.FC = () => (
  <div
    style={{
      position: "fixed",
      zIndex: 9999,
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(255,255,255,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Spin size="large" tip="Đang tải..." />
  </div>
);

export default GlobalLoading;
