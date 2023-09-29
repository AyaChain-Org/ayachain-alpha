# PegoTrack

This repository contains PegoTrack project developed with Next.js, TypeScript, Tailwindcss and RainbowKit for the frontend, and Solidity, Hardhat, and Ethers.js for the smart contract on the backend.

## Live urls

[Frontend](https://pegotrack.vercel.app)

[Smart contract](https://scan.pego.network/address/)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Smart Contract](#smart-contract)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project aims to demonstrate a supply chain management system using blockchain technology. The frontend provides a user interface to interact with the smart contract deployed on the pego blockchain. Users can connect their wallets (Metamask or WalletConnect), view product details, track their movements, and more.

The smart contract facilitates the tracking of products, their states, and histories on the blockchain. It has been developed using Solidity and is deployed on pego blockchain.

## Features

- Wallet connection with Metamask and WalletConnect using RainbowKit.
- Interact with the supply chain smart contract to add products, track their movements, and view histories.
- Responsive and user-friendly UI built with Next.js and Tailwindcss.

## Technologies Used

### Frontend

- Next.js: React framework for building the frontend.
- TypeScript: Provides type checking for JavaScript.
- RainbowKit: Library for handling wallet connections.
- Tailwind: CSS library used for designing the UI.

### Smart Contract

- Solidity: Smart contract programming language.
- Hardhat: Development environment for Ethereum with testing, debugging, and deployment tools.
- Ethers.js: Library for interacting with Ethereum and smart contracts.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/pegotrack/pego-track
   cd ayachain
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the frontend development server:

   ```
   npm run dev
   ```

4. Interact with the frontend on localhost:3000

5. Follow the instructions in the `contract` directory's README to deploy and interact with the smart contract.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Smart Contract (contracts/README.md)

Please refer to the [contract/README.md](contract/README.md) for detailed information about the smart contract, deployment instructions, and interaction details.
