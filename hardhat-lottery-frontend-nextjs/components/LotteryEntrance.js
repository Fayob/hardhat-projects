import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotterEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("");

  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: "",
    contractAddress: "",
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: "",
    contractAddress: "",
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayer } = useWeb3Contract({
    abi: "",
    contractAddress: "",
    functionName: "getNumberOfPlayer",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: "",
    contractAddress: "",
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numberOfPlayerFromCall = (await getNumberOfPlayer()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();
    console.log(entranceFee);
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numberOfPlayerFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="p-5">
      <h2>Lottery Entrance</h2>
      {raffleAddress ? (
        <div className="">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 round ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>EntranceFee: {ethers.formatUnits(entranceFeeFromCall, "ether")} ETH </div>
          <div>Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <p> No Raffle Address detected </p>
      )}
    </div>
  );
}
