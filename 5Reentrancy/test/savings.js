const SavingsAccount = artifacts.require('SavingsAccount.sol');
const Investor = artifacts.require('Investor.sol');

contract('Savings Test', (accounts) => {
  let savingsAccount, investor;
  let deployer = accounts[0];
  let user = accounts[1];

  beforeEach(async () => {
    savingsAccount = await SavingsAccount.new();
    investor = await Investor.new(savingsAccount.address);

    //deposit({ from: web3.eth.accounts[0], value: <amount-in-Wei>}
  });

  it('Should be able to deposit', async () => {
    await savingsAccount.deposit({ from: user, value: 100 });
    var balance = await savingsAccount.balanceOf(user);
    assert.equal(balance, '100', 'has 100');
  });

  it('posible to withdraw', async () => {
    await savingsAccount.deposit({ from: user, value: 100 });
    await savingsAccount.withdraw({ from: user });
    var balance = await savingsAccount.balanceOf(user)
    assert.equal(balance, '0', 'has 0');
  });

  it.only('Attack', async () => {
    
    await savingsAccount.deposit({ from: user, value: web3.utils.toWei('10') });
    await investor.attack({ value: web3.utils.toWei('10') });
    var balance = await web3.eth.getBalance(savingsAccount.address);
    assert.equal(balance, '0', 'has 0');
  });

  
});