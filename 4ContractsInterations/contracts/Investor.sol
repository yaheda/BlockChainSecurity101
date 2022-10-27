// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISavingsAccount {
  function deposit() external payable;
  function withdraw() external;
}

contract Investor is Ownable {
  ISavingsAccount public immutable savingsAccount;

  constructor(address savingsAccountAddress) {
    savingsAccount = ISavingsAccount(savingsAccountAddress);
  }

  function depositIntoSavingsAccount() external payable onlyOwner() {
    savingsAccount.deposit{ value: msg.value }();
  }

  function withdrawFromSavingsAccount() external onlyOwner() {
    savingsAccount.withdraw();
  }



// but because of gas limit check the .call method
  receive() external payable { 
    payable(owner()).transfer(address(this).balance);
  }
}