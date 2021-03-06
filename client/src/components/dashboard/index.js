import React, { useState, useEffect } from "react";

import "./index.css";
// {userDetails &&
//     userDetails.map((item) => {
//       return <div>{item}</div>;
//     })}

const Dashboard = ({ contract, accounts, web3 }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [listOfWorkout, setListOfWorkout] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [isOwner, setIsOwner] = useState(null);
  const [allowance, setAllowance] = useState(null);
  const getListofWorkout = async () => {
    const listWorkout = await contract.methods.getAllWorkouts().call({
      from: accounts[0],
    });
    setListOfWorkout(listWorkout);
    console.log(listWorkout);
  };

  const getUser = async () => {
    const response = await contract.methods.getUser().call({
      from: accounts[0],
    });
    setUserDetails(response);
    console.log(response);
  };

  const submit = async (item, isBuy) => {
    // sessionStorage.setItem("buy", JSON.stringify(item));
    setItemDetails(item);
    // console.log(sessionStorage.getItem("buy"));
    const response = await contract.methods
      .ownershipTransfer(item[0], isBuy)
      .send({
        from: accounts[0],
      });
    const response1 = await contract.methods.getAllWorkouts().call({
      from: accounts[0],
    });
    setListOfWorkout(response1);
    console.log(response1);
    getUser();

    setShowModal(true);
    // window.location.href = "/dashboard";
  };

  const submitRating = async (uuid) => {
    const rating = parseInt(
      document.querySelector('input[name="rating1"]:checked').value
    );
    console.log(rating);
    const response = await contract.methods
      .modifyRating(rating ? rating : 0, uuid)
      .send({
        from: accounts[0],
      });
    console.log(response);
    getListofWorkout();
  };

  const getBalance = async () => {
    const response = await contract.methods.getBalance().call({
      from: accounts[0],
    });
    setUserBalance(response);
    console.log("balance" + response);
  };

  const getAllowance = async () => {
    const response = await contract.methods.checkAllowance().call({
      from: accounts[0],
    });
    setAllowance(response);
  };

  const checkAdmin = async () => {
    const response = await contract.methods.checkOwner().call({
      from: accounts[0],
    });
    setIsOwner(response);
    console.log("IsOwner" + response);
  };

  const getOwner = async (uuid) => {
    if (ownerDetails) {
      setOwnerDetails(null);
      return;
    }
    const response = await contract.methods.getOwner(uuid).call({
      from: accounts[0],
    });
    setOwnerDetails(response);
    console.log(response);
  };

  const airdrop = async () => {
    const amount = parseInt(document.querySelector("#amount").value);

    const address = document.querySelector("#address").value;
    console.log(amount, address);
    console.log(accounts);
    const response = await contract.methods.airDrop(address, amount).send({
      from: accounts[0],
    });
    console.log(response);

    window.location.href = "/dashboard";
  };

  const onAllowance = async () => {
    const amount = parseInt(document.querySelector("#allowance").value);

    const response = await contract.methods.approval(amount).send({
      from: accounts[0],
    });
    console.log(response);

    window.location.href = "/dashboard";
  };

  useEffect(() => {
    console.log("CONTRACT NOW => ", contract);
    if (contract) {
      getUser();
      getListofWorkout();
      getBalance();
      checkAdmin();
      getAllowance();
    }
  }, [contract]);

  return (
    <div class="App">
      <div className="header">
        <div className="header-start">
          <h1>SANKALP</h1>
          <p>Fit Body dwells fit mind and soul</p>
        </div>
        <div className="header-end">
          <button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Link New MetaMask Account
          </button>
        </div>
      </div>

      <div>
        {userDetails && userDetails[0] != "" && (
          <div className="dashboard-header-parent">
            <h1>Dashboard</h1>
            <hr />
            <div className="dashboard-header">
              <div>
                {" "}
                <h2>Welcome {userDetails[0]}</h2>
                <h3>Balance: {userBalance} fitcoin</h3>
              </div>
              {userDetails[2] == "1" && (
                <button
                  onClick={() => {
                    window.location.href = "/addWorkout";
                  }}
                >
                  {" "}
                  ADD WORKOUT
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div>
        {isOwner && (
          <form>
            <h4>AIRDROP</h4>
            <input
              id="address"
              className="textInput"
              type="text"
              placeholder="Enter Address"
            />
            <input
              id="amount"
              className="textInput"
              type="number"
              placeholder="Enter Amount"
            />
            <button type="button" onClick={airdrop}>
              Send
            </button>
          </form>
        )}
        <form>
          <h4>Allowance : {allowance}</h4>
          <input
            id="allowance"
            className="textInput"
            type="number"
            placeholder="Enter Allowed Amount"
          />
          <button type="button" onClick={onAllowance}>
            Approve
          </button>
        </form>
      </div>
      <br />
      <h1 className="mplace-header">MarketPlace</h1>
      <hr />
      <div className="container">
        {listOfWorkout &&
          listOfWorkout.map((item) => {
            if (item[0] == "") return;
            return (
              <div className="card">
                <div className="box">
                  <div className="content">
                    <h3>{item[1]}</h3>
                    <h4 style={{ color: "white" }}>Workout Description</h4>
                    <p> {item[2]}</p>
                    <a
                      href="#"
                      onClick={() => submit(item, false)}
                      style={{ marginRight: "20px" }}
                    >
                      Subscribe | {item[7]} fitcoin
                    </a>

                    <a href="#" onClick={() => submit(item, true)}>
                      Buy | {item[6]} fitcoin
                    </a>
                    <a href="#" onClick={() => getOwner(item[0])}>
                      {ownerDetails ? "Hide Owner Info" : "Show Owner Info"}
                    </a>
                    {ownerDetails && (
                      <div className="ownerDetails">
                        Name: {ownerDetails[0]} <br />
                      </div>
                    )}
                    <br />
                    <br />
                    <span
                      className={`fa fa-star ${item[8] >= 1 ? "checked" : ""}`}
                    ></span>
                    <span
                      className={`fa fa-star ${item[8] >= 2 ? "checked" : ""}`}
                    ></span>
                    <span
                      className={`fa fa-star ${item[8] >= 3 ? "checked" : ""}`}
                    ></span>
                    <span
                      className={`fa fa-star ${item[8] >= 4 ? "checked" : ""}`}
                    ></span>
                    <span
                      className={`fa fa-star ${item[8] >= 5 ? "checked" : ""}`}
                    ></span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div
        id="myModal"
        className={`modal ${showModal ? "modal-visible" : "modal-hidden"} `}
      >
        <div className="modal-content">
          <span
            className="close"
            onClick={() => {
              setShowModal(false);
              window.location.href = "/dashboard";
            }}
          >
            &times;
          </span>
          <p>Thank You for the Purchase!</p>
          <h3>Here are your package details</h3>
          {itemDetails && (
            <div>
              <ol class="gradient-list">
                <li>Name : {itemDetails[1]}</li>
                <li>Description : {itemDetails[2]}</li>
                <li>BodyType : {itemDetails[3]}</li>
                <li>Diet : {itemDetails[4]}</li>
                <li>Exercises : {itemDetails[5]}</li>
              </ol>
            </div>
          )}
          <link rel="stylesheet" type="text/css" href="style.css" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
          />
          <div class="rating-css">
            <div>Kindly rate the Purchase</div>
            <div class="star-icon">
              <input type="radio" name="rating1" id="rating1" value="1" />
              <label for="rating1" class="fa fa-star"></label>
              <input type="radio" name="rating1" id="rating2" value="2" />
              <label for="rating2" class="fa fa-star"></label>
              <input type="radio" name="rating1" id="rating3" value="3" />
              <label for="rating3" class="fa fa-star"></label>
              <input type="radio" name="rating1" id="rating4" value="4" />
              <label for="rating4" class="fa fa-star"></label>
              <input type="radio" name="rating1" id="rating5" value="5" />
              <label for="rating5" class="fa fa-star"></label>
              <button onClick={() => submitRating(itemDetails[0])}>
                Send Rating
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
