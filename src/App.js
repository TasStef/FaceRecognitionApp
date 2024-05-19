import React, { Component } from "react";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import "tachyons";
import ParticlesBg from "particles-bg";
// import Clarifai from "clarifai";

let config = {
  num: [4, 7],
  rps: 0.001,
  radius: [1, 35],
  life: [1.5, 3],
  v: [2, 3],
  tha: [-40, 40],
  alpha: [0.6, 0],
  scale: [0.1, 0.4],
  position: "all",
  color: ["random", "#ff0000"],
  cross: "cross",
  random: 10,
  g: 0.5,
  fullScreen: true,
};

const PAT = "8f25c63151e74ac0bf4cbe13eb803f15";
const USER_ID = "clarifai";
const APP_ID = "main";
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
let IMAGE_URL = "";

function Clarifai() {
  let raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  ////
  console.log("Within Clarifai:");
  console.log(raw);
  /////

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  let response;

  return fetch(
    "https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response error!");
      }
      return response.json();
    })
    .then((result) => {
      const regions = result.outputs[0].data.regions;

      // calculateFaceLocation(result);

      console.log("Result: ");
      console.log(result);

      regions.forEach((region) => {
        // Accessing and rounding the bounding box values
        const boundingBox = region.region_info.bounding_box;
        const topRow = boundingBox.top_row.toFixed(3);
        const leftCol = boundingBox.left_col.toFixed(3);
        const bottomRow = boundingBox.bottom_row.toFixed(3);
        const rightCol = boundingBox.right_col.toFixed(3);

        region.data.concepts.forEach((concept) => {
          // Accessing and rounding the concept value
          const name = concept.name;
          const value = concept.value.toFixed(4);

          // console.log(
          //   `${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`
          // );
        });
      });
      return result;
    })
    .catch((error) => console.log("error", error));
}

const calculateFaceLocation = (data) => {
  // response.outputs[0].data.regions[0].region.region_info.bounding_box

  console.log("within calculateFaceLocation --->");
  console.log(data);

  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  console.log("data ->");
  console.log(clarifaiFace);

  const image = document.getElementById("inputimage");
  const width = Number(image.width);
  const height = Number(image.height);
  console.log(width, height);
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    IMAGE_URL = this.state.input;
    Clarifai()
      .then((result) => {
        console.log("within Button:");
        console.log(result);
        // this.calculateFaceLocation(result);
        calculateFaceLocation(result); //continue here
      })
      .catch((error) => {
        console.log("API Error:", error);
      });
  };

  render() {
    return (
      <div>
        <ParticlesBg type="custom" config={config} bg={true} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
