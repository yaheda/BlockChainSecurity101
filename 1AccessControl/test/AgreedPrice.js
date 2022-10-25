const AgreedPrice = artifacts.require('AgreedPrice.sol');

const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');


contract('Access Control', async (accounts) => {

  let agreedPrice;

  beforeEach(async () => {
    agreedPrice =  await AgreedPrice.new(100);
  });

  it("Agreed Price", async () => {
    var price = await agreedPrice.price();
    assert.equal(price, '100', 'price should be 100');

    await expectRevert(
      agreedPrice.updatePrice(200, { from: accounts[1] }),
      'Ownable: caller is not the owner'
    );

    var price = await agreedPrice.price();
    assert.equal(price, '100', 'new price should be 200');
  });

  it('change owner', async () => {
    await agreedPrice.transferOwnership(accounts[2], { from: accounts[0]});
    var newOwner = await agreedPrice.owner();
    assert.equal(accounts[2], newOwner, "ownership changed");
  });

  it('unhappy change owner', async () => {
    await expectRevert(
      agreedPrice.transferOwnership(accounts[2], { from: accounts[1]}),
      'Ownable: caller is not the owner'
    );
  });

});