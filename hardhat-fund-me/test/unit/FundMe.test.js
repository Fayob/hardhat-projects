const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async function () {
  let deployer;
  let fundMe;
  let mockV3Aggregator;
  const sendLowValue = ethers.parseEther("0.001");
  const sendHighValue = ethers.parseEther("1");
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

  describe("fund", async function () {
    it("Fails if you don't send enough Eth", async function () {
      await fundMe.fund({ value: sendLowValue });
        await expect(fundMe.fund()).to.be.reverted
    });
  });

  describe("update the amount funded data structure", async function () {
    await fundMe.fund({ value: sendHighValue });
    const response = await fundMe.getAddresstoAmountFunded(deployer);
    assert.equal(response.toString(), sendHighValue.toString());
  });

  describe("Adds funder to array of getFunder", async function () {
    await fundMe.fund({ value: sendHighValue });
    const funder = await fundMe.getFunder(0);
    assert.equal(funder, deployer);
  });
});
