import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LoadingComponent = ({ message = "Loading..." }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="text-center">
        <div className="spinner-border text-gray-200" role="status">
          <span className="sr-only"></span>
        </div>
        <div className="mt-2">{message}</div>
      </div>
    </div>
  );
};

export default LoadingComponent;
