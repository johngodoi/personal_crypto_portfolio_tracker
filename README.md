# Crypto Portfolio Tracker

## Overview
The Crypto Portfolio Tracker is a powerful tool designed to help you manage and track your cryptocurrency investments across multiple blockchains and exchanges. With support for Ethereum and Solana, this tracker evaluates current prices using Coingecko, providing you with up-to-date portfolio values.
Stay on top of your crypto investments with the Crypto Portfolio Tracker, your all-in-one solution for managing and visualizing your digital assets.

## Blockchains and Tokens Supported
<p float="left">
<img src="assets/logos/ETH.svg" width="75" height="75" alt="Ethereum"> 
<img src="assets/logos/SOL.svg" width="75" height="75" alt="Solana"> 
<!--<img src="assets/logos/XRP.svg" width="75" height="75" alt="Ripple">
<img src="assets/logos/TRX.svg" width="75" height="75" alt="Tron"> -->
<img src="assets/logos/USDC.svg" width="75" height="75" alt="USDC"> 
<img src="assets/logos/USDT.svg" width="75" height="75" alt="USDT"> 
</p>


## Technology Stack

This project leverages a modern technology stack to ensure robust performance, scalability, and maintainability. Below is an overview of the key technologies used:

### Node.js
Node.js is the runtime environment for executing JavaScript code server-side. It provides an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for building scalable network applications.

### TypeScript
TypeScript is a statically typed superset of JavaScript that enhances code quality and developer productivity. By using TypeScript, we benefit from type checking, improved refactoring, and better tooling support.

### Express
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It is used to handle HTTP requests, routing, and middleware in this project.

### Viem
Viem is a JavaScript library for interacting with Ethereum smart contracts. It simplifies the process of connecting to Ethereum nodes, sending transactions, and calling smart contract methods. Viem is used in this project to facilitate communication with Ethereum smart contracts.

### Solana Web3.js
Solana Web3.js is a JavaScript library for interacting with the Solana blockchain. It provides tools for sending transactions, querying blockchain data, and interacting with Solana smart contracts. This library is essential for integrating Solana support into the project.

### Mocha
Mocha is a feature-rich JavaScript test framework running on Node.js, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases. It is used in this project to write and execute unit and integration tests, ensuring the reliability of the codebase.

## Project Structure

The project is organized into the following directories:

### `/src`
Contains the main source code for the Crypto Portfolio Tracker, including modules for exchange and wallet integrations, blockchain support, and portfolio calculations. The source code is using a simple form of clean architecture for its organization with:

#### `/core`
Containing business logic like entities and use cases.

#### `/presentation`
Containing logic responsible for receiving requests, validating, starting it processing and preparing the proper response.

#### `/shared`
Utility code like drivers that knows how to communicate with each blockchain.


### `/tests`
Includes unit and integration tests to ensure the reliability and correctness of the project's functionality.

### `/config`
Holds configuration files for setting up and managing different environments and dependencies.

### `/docs`
Includes documentation files, such as user guides, API references, and developer notes.

### `/abis`
This directory contains the Application Binary Interface (ABI) files for the smart contracts used in the project. ABIs are essential for interacting with the smart contracts from the TypeScript code, as they define the methods and events available in the contracts. Each ABI file is typically generated when the smart contract is compiled and is used by `viem.js` to facilitate communication with the blockchain.

### `/assets`
This directory contains various assets used in the project, such as images, logos, and other media files.

#### `/assets/logos`
This folder includes logos for the blockchains and stablecoins supported by the project. The logos are in SVG format to ensure high quality and scalability.

## Getting Started

To get started with the Crypto Portfolio Tracker, follow these steps:

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Installation
1. Clone the repository:
  ```sh
  git clone https://github.com/johngodoi/personal_crypto_portfolio_tracker
  cd personal_crypto_portfolio_tracker
  ```

2. Install the dependencies:
  ```sh
  npm install
  ```

### Running the Project
To run the project in development mode, use the following command:
```sh
npm run dev
```
This will start the server and watch for any changes in the source files, automatically restarting the server when changes are detected.

### Running Tests
To execute the unit and integration tests, use the following command:
```sh
npm run test
```
This will run all the tests defined in the `/tests` directory and provide a summary of the test results.

### Building the Project
To build the project for production, use the following command:
```sh
npm run build
```
This will compile the TypeScript code into JavaScript and output the result in the `/dist` directory.

### Starting the Project
To start the project after it has been built, use the following command:
```sh
npm run start
```
This will launch the server using the compiled JavaScript code from the `/dist` directory, allowing you to run the project in a production environment.

## Features
### Exchange Integration
- [ ] Connect to crypto exchanges
  - [ ] crypto.com

### Wallet Integration
- [ ] Connect to wallets
  - [ ] Metamask

### Blockchain Support
- [X] Ethereum
- [X] Solana

### Initial Setup
- [X] Load blockchain information

### User Configuration
- [ ] Define addresses for specific blockchains
  - [ ] Define tokens of interest for each address

### Portfolio Value Calculation
- [X] USD
- [ ] BRL

### Profit/Loss Tracking
- [ ] USD
- [ ] BRL

### Transaction History
- [ ] View transaction history

### Asset Allocation Visualization
- [ ] USD
- [ ] BRL

### Watchlist
- [ ] Create and manage a watchlist of tokens

## Contributing

We welcome contributions from the crypto community! If you're interested in helping develop this project, feel free to reach out.

## License

MIT License


## Stay in Touch
| | | 
--- | ---
name | John Henrique Teixeira de Godoi
e-mail | john.godoi@gmail.com
linkedin | https://www.linkedin.com/in/johngodoi
github | https://github.com/johngodoi
twitter | @john_godoi
mobile | +55 12 98212-8724
ens | johngodoi.eth