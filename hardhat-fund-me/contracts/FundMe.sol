// SPDX-License-Identifier: MIT

// Order of Layout
// Contract elements should be laid out in the following order:
// 1. Pragma statements
// 2. Import statements
// 3. Events
// 4. Errors
// 5. Interfaces
// 6. Libraries
// 7. Contracts

// Pragma
pragma solidity ^0.8.8;

// Imports
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// Error
error FundMe__Unauthorized();

// Interfaces, Libraries, Contracts

// Inside each contract, library or interface, use the following order:
// 1. Type declarations
// 2. State variables
// 3. Events
// 4. Errors
// 5. Modifiers
// 6. Functions

/** @title A contract for crowd funding
 *  @author Abimbola Adedeji
 *  @notice This contract is to demo a sample funding contract
 */ 

contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables!
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] private funders;
    mapping(address => uint256) private addressToAmountFunded;

    address private immutable i_owner;

    AggregatorV3Interface private priceFeed;

    // Modifier
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner!");
        if(msg.sender != i_owner) { revert FundMe__Unauthorized();} // this save more gas than the require code above
        _;
    }

    // Function order include:
    // 1. constructor
    // 2. receive
    // 3. fallback
    // 4. external
    // 5. public
    // 6. internal
    // 7. private
    // 8. view / pure

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    
    // When someone send fund to this contract without using the fund function below
    // This receive function below will get the transaction and then call fund function
    receive() external payable {
        fund();
    }

    // This fallback function will get the transaction if the person sent data with the transaction
    fallback() external payable {
        fund();
    }

    function fund() public payable {
        
        require(
            msg.value.getConversionRate(priceFeed) <= MINIMUM_USD,
            "Not enough token sent"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // reset the array
        funders = new address[](0);
        // withdraw the fund

        //call
        // this is the most efficient way to send fund among the 3 ways
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");

        // // transfer
        // // msg.sender = address
        // // payable(msg.sender) = payable address, a fund must be of payable type to be transfered
        // payable(msg.sender).transfer(address(this).balance);

        // //send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "send failed");
    }

    // view / pure
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return funders[index];
    }

    function getAddressToAmountFunded(address funder) public view returns(uint256){
        return addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return priceFeed;
    }
}
