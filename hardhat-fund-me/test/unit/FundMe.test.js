const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert } = require("chai");

describe("FundMe", async function () {
  let deployer;
  let fundMe;
  let mockV3Aggregator;
  beforeEach(async function () {
    // deploy FundMe Contract
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContractAt("FundMe", deployer);
    mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", deployer);
  });

  describe("constructor", async function () {
    it("sets the aggregator addresses correctly", async function () {
      const response = await fundMe.getPriceFeed;
      const responseRunnerAddress = response._contract.runner.address;
      const mockV3AggregatorRunnerAddress = mockV3Aggregator.runner.address;

      assert.equal(responseRunnerAddress, mockV3AggregatorRunnerAddress);
    });
  });
});
