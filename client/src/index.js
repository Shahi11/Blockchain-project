import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import AddWorkout from "./components/addWorkout";
import SankalpContract from "./contracts/Sankalp.json";
import getWeb3 from "./getWeb3";

const Parent = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    makeConnection();
  }, []);

  const makeConnection = async () => {
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SankalpContract.networks[networkId];
    const instance = new web3.eth.Contract(
      SankalpContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    setWeb3(web3);
    setAccounts(accounts);
    setContract(instance);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={<App contract={contract} accounts={accounts} web3={web3} />}
        />
        <Route
          path="/dashboard"
          exact
          element={
            <Dashboard contract={contract} accounts={accounts} web3={web3} />
          }
        />
        <Route
          path="/addWorkout"
          exact
          element={
            <AddWorkout contract={contract} accounts={accounts} web3={web3} />
          }
        />
      </Routes>
    </Router>
  );
};

ReactDOM.render(<Parent />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
