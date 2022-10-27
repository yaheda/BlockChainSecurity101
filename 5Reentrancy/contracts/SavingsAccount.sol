// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

//import "truffle/Console.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SavingsAccount is ReentrancyGuard {
  using Address for address payable;

  mapping(address => uint256) public balanceOf;

  function deposit() external payable nonReentrant {
    balanceOf[msg.sender] += msg.value;
  }

  function withdraw() external nonReentrant {
    // CHECK
    require(balanceOf[msg.sender] > 0, "not enough"); 

    // EFEECT
    uint256 depositedAmount = balanceOf[msg.sender];
    balanceOf[msg.sender] = 0;

    // INTERACTION
    payable(msg.sender).sendValue(depositedAmount);

    
  }

}