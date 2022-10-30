// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract LogicV2 {
  uint256 public x;
  uint256 public y;

  function increaseX() external {
    x += 2;
  }

  function setY(uint256 _y) external {
    y = _y;
  }
}