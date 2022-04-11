import uuid from "react-uuid";
import React, { useState, useEffect } from "react";

const AddWorkout = ({ contract, accounts, web3 }) => {
  const [userDetails, setUserDetails] = useState(null);
  const getUser = async () => {
    const response = await contract.methods.getUser().call({
      from: accounts[0],
    });
    setUserDetails(response);
    console.log(response);
  };

  useEffect(() => {
    console.log("CONTRACT NOW => ", contract);
    if (contract) {
      getUser();
    }
  }, [contract]);

  const submit = async () => {
    const userID = uuid();
    const name = document.querySelector("#name").value;
    const description = document.querySelector("#description").value;
    const btype = document.querySelector("#btype").value;
    const diet = document.querySelector("#diet").value;
    const reps = document.querySelector("#reps").value;
    const rent = parseInt(document.querySelector("#rent").value);
    const sell = parseInt(document.querySelector("#sell").value);

    const response = await contract.methods
      .addWorkoutPackage(
        userID,
        name,
        description,
        btype,
        diet,
        reps,
        sell,
        rent
      )
      .send({
        from: accounts[0],
      });
    console.log(document.querySelector("#name").value);

    const response1 = await contract.methods.getAllWorkouts().call({
      from: accounts[0],
    });
    console.log(response1);

    window.location.href = "/dashboard";
  };

  return (
    <div className="App">
      <h1>SANKALP</h1>
      <p>Fit Body dwells fit mind and soul</p>
      <form class="search-wrapper cf">
        <p>Welcome Trainer! Please add your workout package</p>
        <br />
        <input
          id="name"
          className="textInput"
          type="text"
          placeholder="Enter Package Name"
        />
        <br />
        <input
          id="description"
          className="textInput"
          type="text"
          placeholder="Enter Package Description"
        />
        <br />
        <input
          id="btype"
          className="textInput"
          type="text"
          placeholder="Enter Body Type"
        />
        <br />

        <input
          id="diet"
          className="textInput"
          type="text"
          placeholder="Enter Diet Routine"
        />
        <br />
        <input
          id="reps"
          className="textInput"
          type="text"
          placeholder="Enter Physical exercise routine"
        />
        <br />
        <input
          id="rent"
          className="textInput"
          type="text"
          placeholder="Enter Subscription cost in WEI"
        />
        <br />
        <input
          id="sell"
          className="textInput"
          type="text"
          placeholder="Enter Selling cost in WEI"
        />
        <br />
        <button type="button" onClick={submit}>
          Add Package
        </button>
        <br />
        <br />
      </form>
    </div>
  );
};

export default AddWorkout;
