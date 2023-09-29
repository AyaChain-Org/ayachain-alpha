const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ayachain", function () {
  async function deployAyaChainFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, distributor, intermediary, customer] = await ethers.getSigners();

    const PegoTrack = await ethers.getContractFactory("PegoTrack");
    const pegoTrack = await PegoTrack.deploy();

    return { pegoTrack, owner, distributor, intermediary, customer };
  }

  it('should create a product', async function () {
    const {pegoTrack, distributor, intermediary, customer} = await loadFixture(
      deployAyaChainFixture
    );
    await pegoTrack.connect(distributor).addProduct(
      'Product 1',
      customer.address,
      intermediary.address,
      'New',
      'Warehouse',
      'Customer house'
    );
  
    const product = await pegoTrack.products(0);
    expect(product.id).to.equal(0);
    expect(product.name).to.equal('Product 1');
    expect(product.state).to.equal(0); // ProductState.Created
    expect(product.distributor).to.equal(distributor.address);
    expect(product.customer).to.equal(customer.address);
    expect(product.intermediary).to.equal(intermediary.address);
    expect(product.condition).to.equal('New');
    expect(product.currentLocation).to.equal('Warehouse');
    expect(product.deliveryLocation).to.equal('Customer house');
  });
  
  it('should allow intermediary ship a product if condition is signed by the distributor', async function () {
    const {pegoTrack, distributor, intermediary, customer} = await loadFixture(
      deployAyaChainFixture
    );

    await pegoTrack.connect(distributor).addProduct(
      'Product 1',
      customer.address,
      intermediary.address,
      'New',
      'Warehouse',
      'Customer house'
    );

    const condition = 'Shipped';

    await pegoTrack.connect(intermediary).shipProduct(
      0,
      condition,
      'Lagos',
      1000000000
    );

    const updatedProduct = await pegoTrack.products(0);
    expect(updatedProduct.state).to.equal(1); // Shipped
  });

  it('should only allow intermediary ship a product', async function () {
    const {pegoTrack, distributor, intermediary, customer} = await loadFixture(
      deployAyaChainFixture
    );

    await pegoTrack.connect(distributor).addProduct(
      'Product 1',
      customer.address,
      intermediary.address,
      'New',
      'Warehouse',
      'Customer house'
    );

    const condition = 'Shipped';

    await expect(pegoTrack.connect(customer).shipProduct(
      0,
      condition,
      'Lagos',
      1000000000
    )).to.be.revertedWith("Only Intermediary can call this function");
  });

  it('should only allow a product in created state to be shipped', async function () {
    const {pegoTrack, distributor, intermediary, customer} = await loadFixture(
      deployAyaChainFixture
    );

    await pegoTrack.connect(distributor).addProduct(
      'Product 1',
      customer.address,
      intermediary.address,
      'New',
      'Warehouse',
      'Customer house'
    );

    const condition = 'Shipped';

    pegoTrack.connect(intermediary).shipProduct(
      0,
      condition,
      'Lagos',
      1000000000
    );

    await expect(pegoTrack.connect(intermediary).shipProduct(
      0,
      condition,
      'Lagos',
      1000000000
    )).to.be.revertedWith("Product is not in Created state");
  });

  it("should allow only intermediary update product location and condition when product is in Shipped state", async function () {
    const {pegoTrack, distributor, intermediary, customer} = await loadFixture(deployAyaChainFixture);

    await pegoTrack.connect(distributor).addProduct(
      'Product 1',
      customer.address,
      intermediary.address,
      'New',
      'Warehouse',
      'Customer house'
    );

    const condition = 'Shipped';

    await expect(pegoTrack.connect(intermediary).updateProduct(0, condition, "Lagos")).to.be.revertedWith("Product is not in Shipped state")

    pegoTrack.connect(intermediary).shipProduct(
      0,
      condition,
      'Lagos',
      1000000000
    );

    await expect(pegoTrack.connect(customer).updateProduct(0, condition, "Lagos")).to.be.rejectedWith("Only Intermediary can call this function");


    await pegoTrack.connect(intermediary).updateProduct(0, condition, "Lagos");
  });

  it('should allow customer mark a product as delivered', async function () {
    const {pegoTrack, distributor, intermediary, customer} = await loadFixture(
      deployAyaChainFixture
    );

    await pegoTrack.connect(distributor).addProduct(
      'Product 1',
      customer.address,
      intermediary.address,
      'New',
      'Warehouse',
      'Customer house'
    );

    const condition = 'Shipped';

    await pegoTrack.connect(intermediary).shipProduct(
      0,
      condition,
      'Lagos',
      1000000000
    );

    await pegoTrack.connect(customer).deliverProduct(0, "Good");

    const updatedProduct = await pegoTrack.products(0);
    expect(updatedProduct.state).to.equal(2); // Delivered
  });
  it('should only allow a product in created shipped state to be delivered', async function () {
    const {pegoTrack, distributor, intermediary, customer} = await loadFixture(
      deployAyaChainFixture
    );

    await pegoTrack.connect(distributor).addProduct(
      'Product 1',
      customer.address,
      intermediary.address,
      'New',
      'Warehouse',
      'Customer house'
    );

    const condition = 'Shipped';

    await expect(pegoTrack.connect(customer).deliverProduct(
      0,
      "Good"
    )).to.be.revertedWith("Product is not in Shipped state");
  });

  it("should return a product history", async function () {
    const {pegoTrack, distributor, intermediary, customer} = await loadFixture(deployAyaChainFixture);

    await pegoTrack.connect(distributor).addProduct(
      'Product 1',
      customer.address,
      intermediary.address,
      'New',
      'Warehouse',
      'Customer house'
    );

    const condition = 'Good';

    pegoTrack.connect(intermediary).shipProduct(
      0,
      condition,
      'Ibadan',
      1000000000
    );


    await pegoTrack.connect(intermediary).updateProduct(0, 'Fair', "Lagos");
    await pegoTrack.connect(intermediary).updateProduct(0, 'Bad', "Ilorin");
    const _history = await pegoTrack.getHistory(0);
    expect(_history[0][0]).to.equal('Warehouse');
    expect(_history[1][1]).to.equal('Good');
  });
  
});
