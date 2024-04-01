// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.waitForDeployment();
  // console.log(deployedCode);
  const contractAddress = await simpleStorage.getAddress();
  console.log(`Deployed contract to: ${contractAddress}`);

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
      await simpleStorage.deploymentTransaction().wait(6)
      await verify(contractAddress, [])
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  // Update the current value
  const transactionResponse = await simpleStorage.store(8);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
}

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

// main
main()
  .then(() => {
    console.log("precess.exit(0)");
    process.exit(0);
  })
  .catch((error) => {
    console.log("process.exit(1)");
    console.error(error);
    process.exit(1);
  });
