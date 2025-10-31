const HDWalletProvider = require('@truffle/hdwallet-provider');

// Replace with your Ganache mnemonic
const mnemonic = "muscle memory library flag lend multiply dream cup boost cupboard middle keep";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};