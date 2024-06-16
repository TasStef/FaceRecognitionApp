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

  clarifai = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      imageURL: this.state.IMAGE_URL,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch("http://127.0.0.1:3000/clarifai", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => console.error(error));
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = async () => {
    await this.setState({ box: {} });

    await this.setState(
      {
        imageUrl: this.state.input,
        IMAGE_URL: this.state.input,
      },
      () => {
        this.clarifai()
          .then((res) => {
            if (res) {
              this.displayFaceBox(this.calculateFaceLocation(res));
              this.fetchIamgeRequest().then((count) =>
                this.setState(
                  Object.assign(this.state.user, { entries: count })
                )
              );
            }
          })
          .catch((err) => {
            console.log("API Error: ", err);
          });
      }
    );
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
      this.setState({ isSignedIn: false, IMAGE_URL: "", user: {} });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    } else {
      this.setState({
        isSignedIn: false,
        IMAGE_URL: "",
        user: {},
        imageUrl: "",
      });
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
