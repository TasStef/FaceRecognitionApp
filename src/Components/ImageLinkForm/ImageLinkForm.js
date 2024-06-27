import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className="center f3">
        {"This Magic Brain will detect faces in your picture. Give it a try!"}
      </p>
      <div className="center">
        <div className={`form pa4 br3 shadow-5`}>
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
            placeholder="IMAGE URL"
          />
          <button
            className="w-30 grow f4 fw9 link:link ph3 pv2 dib ba  br--black black"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
