const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert } = require("chai")

!developmentChains.includes(network.name) 
    ? describe.skip 
    : describe("Raffle Unit Tests", function () {
        let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
        const chainId = network.config.chainId

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture("all")
            raffle = await ethers.getContractAt("Raffle", deployer)
            vrfCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock", deployer)
            raffleEntranceFee = await raffle.getEntranceFee()
            interval =  await raffle.getInterval()
        })

        describe("constructor", function () {
            it("initializes the raffle constructor correctly", async function () {
                const raffleState = await raffle.getRaffleState()
                assert.equal(raffleState.toString(), "0")
                assert.equal(interval.toString(), networkConfig[chainId]["interval"])
            })
        })
    })