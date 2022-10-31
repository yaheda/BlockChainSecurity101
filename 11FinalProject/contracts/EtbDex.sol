// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import { ETBToken } from "./EtbToken.sol";

contract EtbDex {
  address public owner;
  ETBToken private _etbToken;
  uint256 public fee;
  bytes32 private password; /// anyone can see this password

  constructor(address _token, bytes32 _password) public {
    _etbToken = ETBToken(_token);
    password = _password;
    owner = msg.sender;
  }

  /// this owner should be the deployer
  modifier onlyOwner(bytes32 _password) {
    require(password == _password, "You are not the owner!");
    _;
  }

  
  /// overflow
  function buyTokens() external payable {
    require(msg.value > 0, "Should send ETH to buy tokens");
    require(_etbToken.balanceOf(owner) - msg.value >= 0, "Not enough tokens to sell");
    _etbToken.transferFrom(owner, msg.sender, msg.value - calculateFee(msg.value));
  }

  /// overflow
  /// use Address.sendvalue to prevent gas limit
  function sellTokens(uint256 _amount) external {
    require(_etbToken.balanceOf(msg.sender) - _amount >= 0, "Not enough tokens");

    payable(msg.sender).send(_amount);

    _etbToken.burn(msg.sender, _amount);
    _etbToken.mint(_amount);
  }

  /// set fee using owner
  function setFee(uint256 _fee, bytes32 _password) external onlyOwner(_password) {
    fee = _fee;
  }

  /// overflow
  function calculateFee(uint256 _amount) internal view returns (uint256) {
    return (_amount / 100) * fee;
  }

  /// address.sendvalue
  function withdrawFees(bytes32 _password) external onlyOwner(_password) {
    payable(msg.sender).send(address(this).balance);
  }
}
