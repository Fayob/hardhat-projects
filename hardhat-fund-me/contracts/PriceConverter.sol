// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    
    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256) {
        // ABI
        // Address 0x31D04174D0e1643963b38d87f26b0675Bb7dC96e
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(0x31D04174D0e1643963b38d87f26b0675Bb7dC96e);
        (,int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
     }

     function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns(uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUSD = (ethAmount * ethPrice) / 1e18;
        return ethAmountInUSD;
     }
}