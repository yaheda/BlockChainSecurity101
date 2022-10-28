// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract SmallWallet {
  address public owner;

  constructor() {
    owner = tx.origin;
  }

  function withdrawAll(address _recipient) external {
    require(tx.origin == owner, "is not owner");
    payable(_recipient).transfer(address(this).balance);
  }

  receive() external payable { }
}