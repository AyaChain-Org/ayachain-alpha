// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PegoTrack: A supply chain smart contract for tracking product movements and conditions
 */
contract PegoTrack {
    enum ProductState {
        Created,
        Shipped,
        Delivered
    }

    struct Product {
        uint256 id; // Unique product ID
        string name; // Name of the product
        ProductState state; // Current state of the product
        address distributor; // Distributor's address
        address intermediary; // Intermediary's address
        address customer; // Customer's address
        string condition; // Current condition of the product
        string currentLocation; // Current location of the product
        string deliveryLocation; // Delivery location of the product
        uint256 deliveryDate; // Date when the product is expected to be delivered
    }

    struct History {
        string location; // Location at this point in history
        string condition; // Condition of the product at this point
        uint256 timestamp; // Timestamp of the history entry
    }

    Product[] public products; // Array storing all products
    mapping(uint256 => History[]) histories; // Mapping storing histories of products
    uint256 public totalProduct = 0; // Counter for total products created

    event ProductCreated(
        uint256 indexed productId,
        string name,
        string condition,
        string deliveryLocation
    );
    event ProductShipped(uint256 indexed productId, string condition);
    event ProductUpdated(
        uint256 indexed productId,
        string condition,
        string location
    );
    event ProductDelivered(uint256 indexed productId, string condition);

    modifier onlyDistributor(uint256 _productId) {
        require(
            msg.sender == products[_productId].distributor,
            "Only the distributor can call this function"
        );
        _;
    }

    modifier onlyIntermediary(uint256 _productId) {
        require(
            msg.sender == products[_productId].intermediary,
            "Only Intermediary can call this function"
        );
        _;
    }

    modifier onlyCustomer(uint256 _productId) {
        require(
            msg.sender == products[_productId].customer,
            "Only Customer can call this function"
        );
        _;
    }

    constructor() {}

    /**
     * @dev Creates a new product with initial information.
     */
    function addProduct(
        string memory _name,
        address _customer,
        address _intermediary,
        string memory _condition,
        string memory _currentLocation,
        string memory _deliveryLocation
    ) public {
        uint256 _productId = totalProduct;
        histories[_productId].push(
            History(_currentLocation, _condition, block.timestamp)
        );
        products.push(
            Product(
                _productId,
                _name,
                ProductState.Created,
                msg.sender,
                _intermediary,
                _customer,
                _condition,
                _currentLocation,
                _deliveryLocation,
                0
            )
        );
        emit ProductCreated(totalProduct, _name, _condition, _deliveryLocation);
        totalProduct++;
    }

    /**
     * @dev Ships a product, updating its state, condition, and location.
     */
    function shipProduct(
        uint256 _productId,
        string memory _condition,
        string memory _location,
        uint256 _deliveryDate
    ) public onlyIntermediary(_productId) {
        Product memory _product = products[_productId];
        histories[_productId].push(
            History(_location, _condition, block.timestamp)
        );
        require(
            _product.state == ProductState.Created,
            "Product is not in Created state"
        );
        products[_productId].condition = _condition;
        products[_productId].currentLocation = _location;
        products[_productId].deliveryDate = _deliveryDate;
        products[_productId].state = ProductState.Shipped;
        emit ProductShipped(_productId, _condition);
    }

    /**
     * @dev Updates a product's condition and location.
     */
    function updateProduct(
        uint256 _productId,
        string memory _condition,
        string memory _location
    ) public onlyIntermediary(_productId) {
        require(
            products[_productId].state == ProductState.Shipped,
            "Product is not in Shipped state"
        );
        products[_productId].condition = _condition;
        products[_productId].currentLocation = _location;
        histories[_productId].push(
            History(_location, _condition, block.timestamp)
        );
        emit ProductUpdated(_productId, _condition, _location);
    }

    /**
     * @dev Delivers a product, updating its state, condition, and location.
     */
    function deliverProduct(
        uint256 _productId,
        string memory _condition
    ) public onlyCustomer(_productId) {
        Product memory _product = products[_productId];
        require(
            _product.state == ProductState.Shipped,
            "Product is not in Shipped state"
        );
        products[_productId].currentLocation = _product.deliveryLocation;
        products[_productId].condition = _condition;
        histories[_productId].push(
            History(_product.deliveryLocation, _condition, block.timestamp)
        );
        products[_productId].state = ProductState.Delivered;
        emit ProductDelivered(_productId, _condition);
    }

    /**
     * @dev Retrieves the history of a specific product.
     */
    function getHistory(
        uint256 _productId
    ) public view returns (History[] memory) {
        return histories[_productId];
    }

    /**
     * @dev Retrieves a list of all products.
     */
    function getProducts() public view returns (Product[] memory) {
        return products;
    }
}
