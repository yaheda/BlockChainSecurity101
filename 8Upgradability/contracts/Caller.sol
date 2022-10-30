// SPDX-License-Identifer: MIT
pragma solidity 0.8.9;

contract Caller {
  uint256 public x;
  address callee;

  function setCallee(address _callee) external {
    callee = _callee;
  }

  // this will update x of contract callee
  function callx(uint256 _number) external {
    (bool success,) = callee.call(abi.encodeWithSignature("setX(uint256)", _number));
    require(success, "Error");
  }

  // this will update x of contract caller
  function delegateCallX(uint256 _number) external {
    (bool success,) = callee.delegatecall(abi.encodeWithSignature("setX(uint256)", _number));
    require(success, "Error");
  }
}