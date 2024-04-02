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
})