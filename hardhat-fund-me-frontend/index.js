import { ethers } from "./ethers.min.js";
import { contractAddress } from "./constants.js";

const connectbtn = document.getElementById("connectbtn");
const balancebtn = document.getElementById("balancebtn");
connectbtn.onclick = connect;
balancebtn.onclick = getBalance

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
