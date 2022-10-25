const SimpleToken = artifacts.require('SimpleToken.sol');

const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');

contract('SimpleToken', async (accounts) => {
  let simpleToken;
  let deployer = accounts[0];
  let attacker = accounts[1];
  let use = accounts[2];

  beforeEach(async () => {
    simpleToken = await SimpleToken.new(1000);
  });

  it('Happy path - transfer', async () => {
    await simpleToken.transfer(user, 1, { from: deployer});

    let userBalance = await simpleToken.balanceOf(user.address);
    let deployerBalance = await simpleToken.balanceOf(deployer.address);

    assert.equal(userBalance, '1', 'user should have 1 token');
    assert.equal(deployerBalance, '999', 'deplyer has minus 1');
  });

  it('Unhappy - transfer', async () => {
    await expectRevert(
      simpleToken.transfer(user, 2000, { from: deployer }),
      'Not enough tokens'
    );
  });

  it('Should overflow', async () => {
    await simpleToken.transfer(attacker, 10, { from: deployer});
    await simpleToken.transfer(user, 11, { from: attacker});
    // --> in this case without overflow check attacker can big number as it will underflow

    /// How to fix it
    /// 1. change pragma
    /// 2. openzepplin libs SafeMath .add .sub 
    /// using SafeMath for uint256
  });
});