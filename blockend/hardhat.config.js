require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    goerli: {
      chainId: 5,
      blockConfirmations: 6,
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true, //activate it at yarn hardhat test
    outputFile: "gas-report.txt", //add it to gitignore
    noColors: true, //no syntax colors
    currency: "USD", //get the costs in USD in a blockchain like eth
    coinmarketcap: COINMARKETCAP_API_KEY //outcomment it to have USD in gas reporter
},
  solidity: "0.8.17",
  settings: {
    optimizer: { // enables to optimize function calls gas use, in the other part, increases deployment costs
      enabled: true,
      runs: 10000,
    },
  },
  namedAccounts: {
    deployer: {
        default: 0, //set the owner to be named default
    },
    player: {
        //if we want to create a user for some type of test
        default: 1, //users is 1
    },
  },
  mocha: {
    timeout: 200000, //200s max
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY
    }
  }
};
