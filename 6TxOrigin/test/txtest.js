const SmallWallet = artifacts.require('SmallWallet.sol');
const Attacker = artifacts.require('Attacker.sol');

const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');

contract('tx.origin test', (accounts) => {
  let smallWalletInstance, attackerInstance;
  let deployer = accounts[0];
  let attacker = accounts[1];
  let user = accounts[2];

  beforeEach(async () => {
    smallWalletInstance = await SmallWallet.new();    

    await web3.eth.sendTransaction({
      from: deployer,
      to: smallWalletInstance.address,
      value: 10,
    });

    attackerInstance = await Attacker.new(smallWalletInstance.address, { from: attacker });
  });

  it('Happy path', async () => {
    var balance = await web3.eth.getBalance(smallWalletInstance.address);

    assert.equal(balance, 10, '10 wei');

    await smallWalletInstance.withdrawAll(user, { from: deployer });

    balance = await web3.eth.getBalance(smallWalletInstance.address);

    assert.equal(balance, 0, '0 wei');
  });

  it('Rever path', async () => {
    await expectRevert (
      smallWalletInstance.withdrawAll(user, { from: attacker }),
      'is not owner'
    );
  });

  it('Attack', async () => {
    var originalAttackerBalance = await web3.eth.getBalance(attacker);

    var balance = await web3.eth.getBalance(smallWalletInstance.address);
    assert.equal(balance, 10, '10 wei');

    await web3.eth.sendTransaction({
      from: deployer,
      to: attackerInstance.address,
      value: 1,
    });

    

    balance = await web3.eth.getBalance(smallWalletInstance.address);
    assert.equal(balance, 0, '0 wei');

    balance = await web3.eth.getBalance(attackerInstance.address);
    assert.equal(balance, 1, 'frozen balance 1 wei');

    balance = await web3.eth.getBalance(attacker);
    console.log('originalAttackerBalance', web3.utils.toBN(originalAttackerBalance).toString())
    assert.equal(balance, web3.utils.toBN(originalAttackerBalance).add(web3.utils.toBN(10)).toString(), 'all money to attacker');
    
  });
});