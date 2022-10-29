const Auction = artifacts.require('Auction.sol');
const AuctionV2 = artifacts.require('AuctionV2.sol');

const { expectRevert, expectEvent, BN } = require("@openzeppelin/test-helpers");

contract('Dos', ([deployer, attacker, user, user2]) => {
  let auction, auctionv2;

  beforeEach(async () => {
    auction = await Auction.new();
    auctionv2 = await AuctionV2.new();

    await auction.bid({ value: 100 });
    await auctionv2.bid({ value: 100 });
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
      });
      it('Should revert when amount of comutaion hits block gas limit', async () => {
        for(var i = 0; i < 1500; i++) {
          await auction.bid({ value: 150 + i, from: attacker });
        }
        await auction.redundAll();
      });
      
    });

    contract('AuctionV2', () => {
      it('Should withdraw from user', async () => {
        await auctionv2.bid({ from: user, value: web3.utils.toWei('1')});
        await auctionv2.bid({ from: user2, value: web3.utils.toWei('2')});
        // we bid ether this time to make sure the gascost doesnt surpass the actual bid

        const user1Balance = await web3.eth.getBalance(user);

        await auctionv2.withdrawRefund({ from: user });

        const user1BalanceAfter = await web3.eth.getBalance(user);

        var result = web3.utils.toBN(user1BalanceAfter).gt(web3.utils.toBN(user1Balance));
        console.log('Result: ', result);
        console.log('Before: ', user1Balance);
        console.log('After: ', user1BalanceAfter);
        // gas payed by user
        assert(result);
      });
      it.only('sould allow big computations', async () => {
        for (var i = 0; i < 150; i++) {
          await auctionv2.bid({ from: attacker, value: web3.utils.toWei('0.0001') + i});
        }
        const user1Balance = await web3.eth.getBalance(user);

        await auctionv2.withdrawRefund({ from: user });

        const user1BalanceAfter = await web3.eth.getBalance(user);

        var result = web3.utils.toBN(user1BalanceAfter).gt(web3.utils.toBN(user1Balance));
        assert(result);
      });
    });
  })
})