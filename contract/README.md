# AyaChain: Supply Chain Smart Contract

AyaChain is a Solidity smart contract designed for supply chain management. It enables the tracking of product movements, conditions, and histories on the Ethereum blockchain. This README provides an overview of the project, instructions for setting up and deploying the contract using the Hardhat framework, and details on testing and contract usage.

## Deployed contract address

[0xd086dAB59F3d183b77c14E6FbbacC421adCD1634](https://scan.pegotest.net/address/0xd086dAB59F3d183b77c14E6FbbacC421adCD1634/)

## Table of Contents

- [Project Overview](#project-overview)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Contract Deployment](#contract-deployment)
- [Testing](#testing)
- [Deploying](#deploying)
- [Contract Functionality](#contract-functionality)
- [Usage Example](#usage-example)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

AyaChain is a supply chain management smart contract that leverages the Ethereum blockchain to provide transparency and traceability for products. It uses Solidity, a smart contract programming language, and is designed to be deployed on the Ethereum network.

Key features of AyaChain include:

- Tracking the state, condition, and location of products.
- Maintaining a history of product movements and changes in condition.
- Implementing access control to restrict function calls to specific roles (distributor, intermediary).

## Setup

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (recommended version)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)
- [Hardhat](https://hardhat.org/)

### Installation

1. Install project dependencies:

   ```bash
   npm install
   ```

## Contract Deployment

To deploy the AyaChain contract to an Ethereum network using Hardhat:

1. Set environment variables
   Copy .env-example to .env
   ```bash
   cp .env-example .env
   ```
2. Set environment variables in `.env`.
   Open `.env` file and enter your private key
3. Run the deployment script:

   ```bash
   npx hardhat run scripts/deploy.js --network base-goerli
   ```

## Testing

Unit tests ensure the functionality and reliability of the smart contract. To run tests:

```bash
npx hardhat test
```

The tests are defined in the `test` directory.

### Deploying

Deploy contract to baseGoerli network

```bash
npx hardhat run script/deploy.js --network pego-testnet
```

## Contract Functionality

The AyaChain contract provides the following functionality:

- Adding a new product to the supply chain.
- Shipping a product and updating its state, condition, and location.
- Updating a product's condition and location.
- Delivering a product and updating its state, condition, and location.
- Retrieving the history of a specific product.
- Retrieving a list of all products.

## Usage Example

Below is a simple example of how to interact with the AyaChain contract using web3.js in JavaScript:

```javascript
const Web3 = require("web3");
const abi = require("./artifacts/contracts/AyaChain.sol/AyaChain.json").abi;
const contractAddress = "<deployed-contract-address>";
const web3 = new Web3("<node-url>");
const contract = new web3.eth.Contract(abi, contractAddress);

// Interact with the contract functions
// ...
```

Replace `<deployed-contract-address>` and `<node-url>` with the actual contract address and Ethereum node URL.

## Contributing

Contributions are welcome! If you find any issues or have suggestions, please create an issue or submit a pull request.
