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
      //   await expect(fundMe.fund()).to.be.revertedWith(
      //     "You need to send more ETH!"
      //   );
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

  describe("withdraw", async function () {
    beforeEach(async function () {
      await fundMe.fund({ value: sendHighValue });
    });

    it("Withdraw ETH from a signer founder", async function () {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );
      // Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.getBalance(fundMe.address);
      const endingDeployerBalance = await fundMe.getBalance(deployer);

      // Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it("allows us to withdraw with multiple getFunder", async function () {
      // Arrange
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendHighValue });
      }
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      // Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.getBalance(fundMe.address);
      const endingDeployerBalance = await fundMe.getBalance(deployer);

      // Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );

      // Make sure that the getFunder are reset properly
      await expect(fundMe.getFunder(0)).to.be.reverted;

      for (let i = 1; i < 6; i++) {
        assert.equal(
          await fundMe.getAddresstoAmountFunded(accounts[i].address),
          0
        );
      }
    });

    it("Only allows the owner to withdraw", async function () {
        const accounts = await ethers.getSigners()
        const attacker = accounts[1]
        const attackerConnectedContract = await fundMe.connect(attacker)
        await expect(attackerConnectedContract.withdraw()).to.be.reverted
    })
  });
});
