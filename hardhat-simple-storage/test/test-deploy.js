const { ethers } = require("hardhat");
const { assert } = require("chai")

// describe("SimpleStorage", () => {}) // another way you can write a test using arrow function

describe("SimpleStorage", function () {
  let simpleStorageFactory, simpleStorage;
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("Should start with a favourite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0";

    assert.equal(currentValue.toString(), expectedValue)
    // expect(currentValue.toString()).to.equal(expectedValue)
  })

  it("Should update when we call store", async function () {
    const expectedValue = 100;
    const transactionResponse = await simpleStorage.store(expectedValue);
    await transactionResponse.wait(1)

    const updatedValue = await simpleStorage.retrieve();
    assert.equal(updatedValue, expectedValue);
  })
})