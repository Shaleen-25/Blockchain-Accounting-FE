import React from "react";
import { ToastContainer } from "react-toastify";
import "./index.scss";

const LoggedOutWrapper = ({ children }) => {
  return (
    <div className="landing">
      <h2 id="heading">
        <i>Welcome to Blockchain Based Accounting Platform</i>
      </h2>
      <p id="subHeading">
        Department of Accountancy and Business Statistics <br /> Mohanlal
        Sukhadia University, Udaipur
      </p>
      <img
        alt="bgimg"
        id="bgimg"
        src="https://react-next-landing.redq.io/_next/static/images/banner-bg-7cd39473df03c970027bf99aed3e7a3b.png"
      />
      {children}
      <ToastContainer />
    </div>
  );
};

export default LoggedOutWrapper;
