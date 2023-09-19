require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    'pego': {
      url: 'https://pegorpc.com/',
      accounts: [process.env.WALLET_KEY],
    },
    // for testnet
    'pego-testnet': {
      url: 'https://rpc.pegotest.net/',
      accounts: [process.env.WALLET_KEY],
    },
  },
};
