import React, { Component } from "react";
import "./App.css";

class App extends Component {
  runExample = async () => {};

  submit = async () => {
    const { accounts, contract } = this.props;

    const memberType = parseInt(
      document.querySelector('input[name="memberType"]:checked').value
    );

    const name = document.querySelector("#name").value;

    console.log(accounts);
    const response = await contract.methods
      .registerUser(memberType, name)
      .send({
        from: accounts[0],
        // gasLimit: 6000000,
      });
    console.log(accounts);
    console.log(response);

    window.location.href = "/dashboard";
  };

  render() {
    console.log(this.props);
    if (!this.props.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="header">
          <div className="header-start">
            <h1>SANKALP</h1>
            <p>Fit Body dwells fit mind and soul</p>
          </div>
          <div className="header-end">
            <p> Already a User? </p>
            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              {" "}
              Go to Dashboard
            </button>
          </div>
        </div>

        <form class="search-wrapper cf">
          <p>Your MetaMask Account will be used for registration </p>
          <br />
          <input
            id="name"
            className="textInput"
            type="text"
            placeholder="Enter Name"
          />
          <br />
          <p>You will get free 250 fitcoin upon registration</p>
          <br />
            <input
            type="radio"
            id="Trainer"
            name="memberType"
            value="1"
          />  <label>Trainer</label>
            <input type="radio" id="Member" name="memberType" value="2" /> {" "}
          <label>Member</label>
          <br />
          <br />
          <button type="button" onClick={this.submit}>
            Get Started
          </button>
        </form>
      </div>
    );
  }
}

export default App;
