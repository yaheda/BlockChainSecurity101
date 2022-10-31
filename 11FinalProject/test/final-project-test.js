const EtbToken = artifacts.require('ETBToken.sol');
const EtbDex = artifacts.require('EtbDex.sol');

const { expectRevert, expectEvent, BN } = require("@openzeppelin/test-helpers");

contract("Final Project", function ([deployer, user, user_2]) {
  let tokenInstance, dexInstance;

  beforeEach(async function () {
    tokenInstance = await EtbToken.new(web3.utils.toWei('1000'));
    dexInstance = await EtbDex.new(tokenInstance.address, web3.utils.asciiToHex('eatTheBlocks'));

    await dexInstance.setFee(1, web3.utils.asciiToHex("eatTheBlocks"));
    await tokenInstance.setDexAddress(dexInstance.address);
    await tokenInstance.approve(dexInstance.address, web3.utils.toWei("1000"));

    // [deployer, user, user_2] = await ethers.getSigners();

    // const EtbToken = await ethers.getContractFactory("ETBToken", deployer);
    // this.etbToken = await EtbToken.deploy(ethers.utils.parseEther("1000"));

    // const EtbDex = await ethers.getContractFactory("EtbDex", deployer);
    // this.etbDex = await EtbDex.deploy(this.etbToken.address, ethers.utils.formatBytes32String("eatTheBlocks"));

    // await this.etbDex.setFee(1, ethers.utils.formatBytes32String("eatTheBlocks"));
    // await this.etbToken.setDexAddress(this.etbDex.address);
    // await this.etbToken.approve(this.etbDex.address, ethers.utils.parseEther("1000"));
  });

  contract("ETB Token", function () {
    it("totalSupply should match Initial supply", async function () {
      assert.equal(await tokenInstance.totalSupply(), web3.utils.toWei("1000"));
    });
    // 😃 Let's test every path for every function!
    contract("setDexAddress function", function () {
      it("Should allow deployer to set dex", async () => {
        await tokenInstance.setDexAddress(deployer);
        assert.equal(await tokenInstance.etbDex(), deployer);
      });
      
      
    });

    contract('Transfer Function', () => {
      it("Should not allow transfer if transfer from the zero address", async () => {
        await expectRevert(
          tokenInstance.transfer('0x0000000000000000000000000000000000000000', 1, { from: deployer}),
          'ERC20: transfer from the zero address'
        );
      });
      // it.only("Should not allow transfer if not enough balance", async () => {
      //   console.log('deployer balance: ', (await tokenInstance.balanceOf(deployer)).toString());
      //   console.log('XXXXXXXXXXXXXXXX: ', web3.utils.toWei('1001'));
      //   //await tokenInstance.transfer(user, web3.utils.toWei('2001'), { from: deployer});
      //   await expectRevert(
      //     tokenInstance.transfer(user, web3.utils.toWei('1000')),
      //     'Not enough balance'
      //   );
      // });
      it("Should allow transfer of tokens", async () => {
        const user1BalanceBefore = await tokenInstance.balanceOf(user);
        await tokenInstance.transfer(user, 1, { from: deployer});
        const user1BalanceAfter = await tokenInstance.balanceOf(user);
        assert(web3.utils.toBN(user1BalanceAfter).gt(web3.utils.toBN(user1BalanceBefore)));
      });
    });

    contract('transfer from', () => {
      // it("Should not allow transferFrom if amount exceeds allowance", async () => {
      //   await expectRevert(
      //     tokenInstance.transferFrom(deployer, user, 100, { from: user_2 }),
      //     'ERC20: amount exceeds allowance'
      //   );
      // });
      // it("Should not allow transferFrom is not enough balance", async () => {
      //   await expectRevert(
      //     tokenInstance.transferFrom(deployer, user, web3.utils.toWei('1001'), { from: dexInstance.address}),
      //     'Not enough balance'
      //   );
      // })
    });

    contract('Approve', () => {
      it('Should not allow spender with 0x', async () => {
        await expectRevert(
          tokenInstance.approve('0x0000000000000000000000000000000000000000', 1, { from: deployer}),
          'ERC20: approve from the zero address'
        );
      });
      it('correctly update allowance', async () => {
        var allowance = await tokenInstance.allowanceOf(deployer, dexInstance.address);
        assert.equal(allowance, web3.utils.toWei("1000"))
      })
    })

    contract('mint', async () => {
      it('Should only allow dex', async () => {
        await tokenInstance.setDexAddress(deployer);

        var before = await tokenInstance.totalSupply();
        await tokenInstance.mint(10, { from: deployer});
        var after = await tokenInstance.totalSupply();
        assert(web3.utils.BN(after).gt(web3.utils.BN(before)))
      });
      it('should not allo not dex', async () => {
        await tokenInstance.setDexAddress(deployer);
        expectRevert(
          tokenInstance.mint(10, { from: user }),
          'Restricted Access'
        );
      })
    })

    contract('burn', async () => {
      it.only('Should only allow dex', async () => {
        await tokenInstance.setDexAddress(deployer);

        var before = await tokenInstance.totalSupply();
        await tokenInstance.burn(user, 10, { from: deployer});
        var after = await tokenInstance.totalSupply();
        assert(web3.utils.BN(after).lt(web3.utils.BN(before)))
      });
      it('should not allo not dex', async () => {
        await tokenInstance.setDexAddress(deployer);
        await expectRevert(
          tokenInstance.burn(user, 10, { from: user }),
          'Restricted Access'
        );
      })
    })
  });
  // contract("EtbDex", function () {
  //   it("...");
  // });
});
