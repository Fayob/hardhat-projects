// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

contract SimpleStorage {
    uint256 favouriteNumber;

    mapping(string => uint256) public nameToFavouriteNumber;

    struct People {
        uint256 favouriteNumber;
        string name;
    }

    // uint256[] public favouriteNumberLists; // an array of unint256
    People[] public people;

    // The keyword "virtual" need to be added to the parent contract value
    // In order to allow a child contract to override it
    function store(uint256 _favouriteNumber) public virtual {
        favouriteNumber = _favouriteNumber;
        favouriteNumber = favouriteNumber;
    }

    // view, pure
    function retrieve() public view returns(uint256){
        return favouriteNumber;
    }

    function addPerson(string memory _name, uint256 _favouriteNumber) public {
        // people.push(People({favouriteNumber: _favouriteNumber, name: _name})); // it does the same thing as the 2 line of code below
        People memory newPerson = People({favouriteNumber: _favouriteNumber, name: _name});
        people.push(newPerson);
        nameToFavouriteNumber[_name] = _favouriteNumber;
    }
}