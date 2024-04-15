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