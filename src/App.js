import React, { Component } from "react";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation.js";
import Logo from "./Components/Logo/Logo.js";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm.js";
import Rank from "./Components/Rank/Rank.js";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition.js";
import "tachyons";
import ParticlesBg from "particles-bg";
import SignIn from "./Components/SignIn/SignIn.js";
import Register from "./Components/Register/Register.js";

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      PAT: "8f25c63151e74ac0bf4cbe13eb803f15",
      USER_ID: "clarifai",
      APP_ID: "main",
      MODEL_ID: "face-detection",
      MODEL_VERSION_ID: "6dc7e46bc9124c5c8824be4822abe105",
      IMAGE_URL: "",
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }

  clarifai = async () => {
    const { PAT, USER_ID, APP_ID, MODEL_ID, MODEL_VERSION_ID, IMAGE_URL } =
      this.state;

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

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

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
        return result;
      })
      .catch((error) => {
        return error;
      });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = async () => {
    await this.setState({
      imageUrl: this.state.input,
      IMAGE_URL: this.state.input,
    });

    try {
      let result = await this.clarifai();
      if (result) {
        this.displayFaceBox(this.calculateFaceLocation(result));
        let count = await this.fetchIamgeRequest();
        console.log("Count:", count);
        this.setState(Object.assign(this.state.user, { entries: count }));
      }
    } catch (error) {
      console.log("API Error: ", error);
    }
  };

  fetchIamgeRequest = () => {
    const myHeaders = new Headers();
    const url = "http://127.0.0.1:3000/image";
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: this.state.user.id,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => result)
      .catch((error) => console.error(error));
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    const box = {
      left_col: clarifaiFace.left_col * width,
      top_row: clarifaiFace.top_row * height,
      right_col: width - clarifaiFace.right_col * width,
      bottom_row: height - clarifaiFace.bottom_row * height,
    };

    return box;
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onRouteChange = (route) => {
    this.setState({ route: route });
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    } else {
      this.setState({ isSignedIn: false });
    }
  };

  loadUser = (userData) => {
    const { id, name, email, entries, joined } = userData;
    this.setState({
      user: {
        id: id,
        name: name,
        email: email,
        entries: entries,
        joined: joined,
      },
    });
  };

  render() {
    return (
      <div>
        <ParticlesBg type="custom" config={config} bg={true} />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
