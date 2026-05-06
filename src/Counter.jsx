import React from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }
  handleDecrement() {
    this.setState((c) => {
      return { count: c.count - 1 };
    });
  }

  handleIncrement() {
    this.setState((c) => {
      return { count: c.count + 1 };
    });
  }

  render() {
    return (
      <div className="App">
        <button className="dec" onClick={this.handleDecrement}>
          -
        </button>
        <span className="value" style={{ fontSize: "2.5rem", margin: "0 5px" }}>
          {this.state.count}
        </span>
        <button className="inc" onClick={this.handleIncrement}>
          +
        </button>
      </div>
    );
  }
}

export default Counter;
