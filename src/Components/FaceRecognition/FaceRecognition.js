import React from "react";

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" src={imageUrl} width={"700px"} height={"auto"} />
      </div>
    </div>
  );
};

export default FaceRecognition;
