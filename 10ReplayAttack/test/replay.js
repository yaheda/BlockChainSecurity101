const MultiSigWallet = artifacts.require('MultiSigWallet');

contract("Replay Atatck", ([deployer, adminOne, adminTwo, user, attacker]) => {
  let multiSigInstance;

  beforeEach(async () => {
    multiSigInstance = await MultiSigWallet.new();

    await web3.eth.sendTransaction({
      from: adminOne,
      to: multiSigInstance.address,
      value: web3.utils.toWei('10')
    });
  });

  contract('MultiSigWallet', async () => {
    it('Should allow transfer funds after both signatures', async () => {
      const before = web3.eth.getBalance(user);
      const amount = web3.utils.toWei('1');

      /// Message Encoding
      
    });
  });
});