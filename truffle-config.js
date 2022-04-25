const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          "series hundred chest slam citizen obscure giant bike jazz year economy category",
          "https://ropsten.infura.io/v3/583c390b136946bb8179a407e7eaad6e"
        ),
      network_id: 3,
    },
  },
  compilers: {
    solc: {
      version: "0.8.12",
    },
  },
};
