const Auction = artifacts.require('Auction.sol');

const { expectRevert, expectEvent, BN } = require("@openzeppelin/test-helpers");

contract('Dos', ([deployer, attacker, user, user2]) => {
  let auction;

  beforeEach(async () => {
    auction = await Auction.new();

    await auction.bid({ value: 100 });
  });

  contract('Auction', () => {
    contract('If bid is lower than highest bid', () => {
      it('Should not accept bids lower than current', async () => {
        await expectRevert(
          auction.bid({ from: user, value: 10}),
          'bid not enough'
        );
      });
    });

    contract('If bid is higher than highest bid', () => {
      it('Should accept and update', async () => {
        await auction.bid({ from: user, value: 150});
        assert.equal(await auction.highestBid(), '150');
      });
      it('Should make user the current leader', async () => {
        await auction.bid({ from: user, value: 150});
        assert.equal(await auction.currentLeader(), user);
      });
      it('Should add previous leader and highestbid to refync', async () => {
        await auction.bid({ from: user, value: 150});
        var refund = await auction.refunds(0);
        assert.equal(refund[0], deployer);
        assert.equal(refund[1], 100);
      });
    });

    contract('When call refundAll', () => {
      it('Should refund the bidders that didnt win', async () => {
        await auction.bid({ from: user, value: 150});
        await auction.bid({ from: user2, value: 200});

        const user1Balance = await web3.eth.getBalance(user);

        await auction.redundAll();

        const user1BalanceAfter = await web3.eth.getBalance(user);

        assert.equal(user1BalanceAfter, web3.utils.toBN(user1Balance).add(web3.utils.toBN(150)).toString());
      })
    });
  })
})