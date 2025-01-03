require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-deploy")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfimations: 1,
    },
    sepolia: {
      chainId: 11155111,
      blockConfimations: 6,
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY]
    },
  },
  solidity: "0.8.27",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1
    }
  },
  mocha: {
    timeout: 300000 // 300 seconds max
  }
};
