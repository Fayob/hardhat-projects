const { run } = require("hardhat")

async function verify(contractAddress, args) {
    console.log("Verfying contract....");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
      });
    } catch (error) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("Already Verified!");
      } else {
        console.log(error);
      }
    }
  }

  module.exports = { verify }