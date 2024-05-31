const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = getNamedAccounts();

  log("--------------------------------");
  const args = [];
  const basicNft = await deploy("BasicNFT", {
    from: deployer,
    to: args,
    log: true,
    waitConfirmation: network.config.blockConfimrations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying....");
    await verify(basicNft.address, arguments);
  }
  log("--------------------------------");
};
