// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgreedPrice is Ownable {
  uint256 public price;
  //address public admin;

  constructor(uint256 _price) {
    //admin = msg.sender;

    price = _price;
  }

  // function changeAdmin(address _newAdmin) external onlyAdmin() 
  // {
  //   admin = _newAdmin;
  // }

  function updatePrice(uint256 _price) external onlyOwner()
  {
    
    price = _price;
  }

  // modifier onlyAdmin()  {
  //   require(msg.sender == admin, "only admin");
  //   _;
  // }
}