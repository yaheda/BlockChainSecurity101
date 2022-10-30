const Lottery = artifacts.require('Lottery.sol');
const { expectRevert, expectEvent, BN } = require("@openzeppelin/test-helpers");
const { promisify } = require('util');
contract('Weak randomness', ([deployer, attacker, user]) => {
  let lotteryInstance;

  beforeEach(async () => {
    lotteryInstance = await Lottery.new();
  });

  contract('Lottery', () => {
    contract('With bets open', () => {
      it('Should all user to place bet', async () => {
        await lotteryInstance.placeBet(5, { value: web3.utils.toWei('10') });
        assert.equal(await lotteryInstance.bets(deployer), 5);
      });
      it('Should rever if more than one bet', async () => {
        await lotteryInstance.placeBet(5, { value: web3.utils.toWei('10') });
        await expectRevert(
          lotteryInstance.placeBet(5, { value: web3.utils.toWei('10') }),
          'only 1 bet per player'
        );
      });
      it('Should rever if bet is not 10 eth', async () => {
        await expectRevert(
          lotteryInstance.placeBet(5, { value: web3.utils.toWei('5') }),
          'bet cost: 10 ether'
        );
      });
      
      it('Should revert if not 8 bit number', async () => {
        await expectRevert(
          lotteryInstance.placeBet(0, { value: web3.utils.toWei('10') }),
          'must be 8 bit nubmer'
        );
      })
    });

    contract('With bets closed', () => {
      it('Should revert if bets are closed', async () => {
        await lotteryInstance.placeBet(5, { value: web3.utils.toWei('10') });
        await lotteryInstance.endLoterry()

        await expectRevert(
          lotteryInstance.placeBet(5, { value: web3.utils.toWei('5') }),
          'bets are closed'
        );
      });
      it('Should allow only winner to withdraw', async () => {
        await lotteryInstance.placeBet(5, { value: web3.utils.toWei('10'), from: user });
        await lotteryInstance.placeBet(56, { value: web3.utils.toWei('10'), from: attacker });
        await lotteryInstance.endLoterry()

        let winningNumber = 0;
        while (winningNumber != 5) {
          await lotteryInstance.endLoterry()
          winningNumber = await lotteryInstance.winningNumber();
          console.log(winningNumber.toString());
        }

        await expectRevert(
          lotteryInstance.withdrawPrize({ from: attacker }),
          'not winning number'
        );

        var userInitial = await web3.eth.getBalance(user);
        await lotteryInstance.withdrawPrize({ from: user });
        var userAfter = await web3.eth.getBalance(user);

        assert(web3.utils.toBN(userAfter).gt(web3.utils.toBN(userInitial)));
      })
    });

    contract('Attack', () => {

      it.only('Should mine timestamp', async () => {
        await lotteryInstance.placeBet(35, { value: web3.utils.toWei('10'), from: user });
        await lotteryInstance.placeBet(5, { value: web3.utils.toWei('10'), from: attacker });
        
        var setTimestamp = () => {
          return new Promise((resolve, reject) => {
            web3.currentProvider.send({
              jsonrpc: '2.0',
              method: 'evm_setNextBlockTimestamp',
              params: [1667076752],
              id: new Date().getTime()
            }, (err, result) => {
              if (err) { return reject(err) }
              return resolve(result)
            })
          })
        }

        await promisify(web3.currentProvider.sendAsync.bind(web3.currentProvider))({
          jsonrpc: '2.0',
          method: 'evm_setNextBlockTimestamp',
          params: [1667076752],
          id: new Date().getTime(),
        });

        //await setTimestamp();

        // web3.currentProvider.send({
        //   method: "evm_setNextBlockTimestamp", 
        //   params: [1667075290],
        //   jsonrpc: "2.0",
        // });
        
        let winningNumber = 0;
        while (winningNumber != 5) {
          await lotteryInstance.endLoterry()
          winningNumber = await lotteryInstance.winningNumber();
          console.log(winningNumber.toString());
        }
  
        console.log(await web3.eth.getBlock('latest'))
      })
      
    });
  })
})