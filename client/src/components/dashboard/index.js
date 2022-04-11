import React, { useState, useEffect } from "react";

import "./index.css";
// {userDetails &&
//     userDetails.map((item) => {
//       return <div>{item}</div>;
//     })}

const Dashboard = ({ contract, accounts, web3 }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [listOfWorkout, setListOfWorkout] = useState(null);

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

  const submit = async (uuid, isBuy) => {
    console.log(uuid);
    console.log(isBuy);
    const response = await contract.methods
      .ownershipTransfer(uuid, isBuy)
      .send({
        from: accounts[0],
      });
    const response1 = await contract.methods.getAllWorkouts().call({
      from: accounts[0],
    });
    setListOfWorkout(response1);
    console.log(response1);

    window.location.href = "/dashboard";
  };

  useEffect(() => {
    console.log("CONTRACT NOW => ", contract);
    if (contract) {
      getUser();
      getListofWorkout();
    }
  }, [contract]);

  return (
    <div class="App">
      <h1>SANKALP</h1>
      <p>Fit Body dwells fit mind and soul</p>
      <h1>Dashboard</h1>

      <div>
        {userDetails && userDetails[2] == "1" && (
          <div>
            <h3>Welcome {userDetails[0]}</h3>
            <h4>Your Balance is {userDetails[1]} WEI</h4>
            <button
              onClick={() => {
                window.location.href = "/addWorkout";
              }}
            >
              {" "}
              ADD WORKOUT
            </button>
          </div>
        )}
      </div>
      <br />
      <br />
      <br />
      <h1>MarketPlace</h1>
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
                      onClick={() => submit(item[0], false)}
                      style={{ backgroundColor: "green", marginRight: "20px" }}
                    >
                      Subscribe
                    </a>

                    <a href="#" onClick={() => submit(item[0], true)}>
                      Buy
                    </a>
                    <a href="#">Read More</a>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dashboard;
