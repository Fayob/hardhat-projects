import { ethers } from "./ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connectbtn = document.getElementById("connectbtn");
const fundbtn = document.getElementById("fundbtn");
const balancebtn = document.getElementById("balancebtn");
const withdrawbtn = document.getElementById("withdrawbtn");
connectbtn.onclick = connect;
fundbtn.onclick = fund;
balancebtn.onclick = getBalance
withdrawbtn.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Ethereum network can be found in this browser");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected!");
    document.getElementById("connectbtn").innerHTML = "Connected!";
  } else {
    console.log("Ethereum network not found");
    console.log("Not Connectwed!");
    document.getElementById("connectbtn").innerHTML =
      "Please install metamask on your device!";
  }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        // console.log(balance);
        console.log(ethers.parseEther(balance.toString()));
    } else {
        console.log("please connect to a provider first");
    }
 }
// fund
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Account funded with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      });

      // listen for transaction to be mined
      await listenForTxToBeMined(transactionResponse, provider)
      console.log("Done!");
      
    } catch (error) {
      console.log(error);
    }
  }
}

// withdraw
async function withdraw() {
    const ethAmount = 2
  console.log(`Withdrawing  ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
        const transactionResponse = contract.withdraw()
        await listenForTxToBeMined(transactionResponse, provider)
    } catch (error) {
        console.log(error);
    }
  }
}

function listenForTxToBeMined(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  // listen for this transacrion to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionRecieipt) => {
      console.log(
        `Completed with ${transactionRecieipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

