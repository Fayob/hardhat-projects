const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.parseEther("0.25") // 0.25 is the premium. It costs 0.25 LINK per request
const GAS_PRICE_LINK = 1e9 // calculated value based on the gas price of the chain

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        console.log("Local network detected! Deploying mocks...");
        
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true
        })
        log("Mocks deployed!")
        log("---------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]