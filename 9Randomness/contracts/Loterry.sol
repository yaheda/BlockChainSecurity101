// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Lottery is Ownable {
  using Address for address payable;

  uint8 public winningNumber;
  mapping(address => uint8) public bets;
  bool public betsClosed;
  bool public prizeTaken;

  function placeBet(uint8 _number) external payable {
    require(bets[msg.sender] == 0, "only 1 bet per player");
    require(msg.value == 10 ether, "bet cost: 10 ether");
    require(betsClosed == false, "bets are closed");
    require(_number > 0 && _number <= 255, "must be 8 bit nubmer");

    bets[msg.sender] = _number;
  }

  function endLoterry() external onlyOwner {
    betsClosed = true;
    winningNumber = pseudoRandom();
  }

  function withdrawPrize() external payable {
    require(prizeTaken == false, "prize already taken");
    require(betsClosed == true, "bets still open");
    require(bets[msg.sender] == winningNumber, "not winning number");

    prizeTaken = true;
    payable(msg.sender).sendValue(address(this).balance);
  }

  /// the timestamp can be set by a miner to generate the next number
  /// evm_setNextBlockTimestamp
  function pseudoRandom() private view returns (uint8) {
    return uint8(uint256(keccak256(abi.encode(block.timestamp))) % 254) + 1;
  }
  
}