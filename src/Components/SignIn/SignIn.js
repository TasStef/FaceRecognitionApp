import React from "react";
import "tachyons";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  onSubmitSignIn = () => {
    const url = "https://facerecognitionserver.onrender.com/signin";
    const headers = { "Content-Type": "application/json" };

    const body = JSON.stringify({
      email: this.state.signInEmail,
      password: this.state.signInPassword,
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: body,
      redirect: "follow",
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          this.props.loadUser(data);
          this.props.onRouteChange("home");
        }
      });
  };

  render() {
    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 shadow-1 center">
        <main className="pa4 black-80">
          <div className="">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f4 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                className="f1 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
                onClick={this.onSubmitSignIn}
                // onClick={() => onRouteChange("home")}
              />
            </div>
            <div className="lh-copy mt3">
              <legend
                className="f6 fw6 ph0 mh0 pointer"
                // onClick={this.onSubmitSignIn}
                onClick={() => this.props.onRouteChange("register")}
              >
                Register
              </legend>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default SignIn;
