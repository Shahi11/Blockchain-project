import React, { Component } from "react";
import "./App.css";

class App extends Component {
  runExample = async () => {
    // Register Seller
    // Add component
    // const response = await contract.methods
    //   .addWorkoutPackage(
    //     "a",
    //     "Lean",
    //     "Low-carb",
    //     "pushups:10,benchpress:10",
    //     10
    //   )
    //   .send({ from: accounts[0], value: 2 });
    // console.log(response);
    // Register buyer
    // const response = await contract.methods
    //   .registerUser(1)
    //   .send({ from: accounts[0], value: 100 });
    // console.log(response);
    // Transfer ownership (Buy component)
    // const response = await contract.methods
    //   .ownershipTransfer("a")
    //   .send({ from: accounts[0], value: 2 });
    // console.log(response);
    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.getOwner("a").call();
    // console.log(response);
    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

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
        value: parseInt(document.querySelector("#escrow").value),
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
          <input
            id="escrow"
            className="textInput"
            type="text"
            placeholder="Enter Initial amount for your Account"
          />
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
