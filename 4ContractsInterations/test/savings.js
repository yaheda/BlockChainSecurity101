const SavingsAccount = artifacts.require('SavingsAccount.sol');
const Investor = artifacts.require('Investor.sol');

contract('Test Savings', (accounts) => {
  let savingsAccount, investor;
  let deployer = accounts[0];
  let user = accounts[1]

  beforeEach(async () => {
    savingsAccount = await SavingsAccount.new();
    investor = await Investor.new(savingsAccount.address);
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
  })

  it('deposit though investor', async() => {
    await investor.depositIntoSavingsAccount({ value: 100 });
    var balance = await savingsAccount.balanceOf(investor.address);
    assert.equal(balance, '100', 'has 100');
  });

  it('withdraw through investor', async () => {
    await investor.depositIntoSavingsAccount();
    await investor.withdrawFromSavingsAccount();

    var balance = await savingsAccount.balanceOf(investor.address);
    assert.equal(balance, '0', 'has 0');
  });
});