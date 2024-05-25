import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import "tachyons";
import brain from "./brain.png";

const Logo = () => {
  return (
    <div
      className="ma10 mt0 w4 h4"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Tilt
        className={`br4 shadow-4 w4 h4 internal_box`}
        tiltReverse={true}
        tiltMaxAngleX={20}
        scale="1.1"
        perspective="500"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img style={{ paddingTop: "15px" }} src={brain} alt="logo" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
