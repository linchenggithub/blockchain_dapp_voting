
# Voting application on Blockchain 


## Dependencies
Install these prerequisites
- NPM
- Truffle
- Ganache
- Metamask

## Step 1. Clone the project
`git clone https://github.com/linchenggithub/blockchain_dapp_voting.git`

## Step 2. Install dependencies
```
$ cd election
$ npm install
$ npm install --save-dev @truffle/hdwallet-provider
```
## Step 3. Start make changes to the secret.json file
Enter your secret recovery passord for Metamask into memonics
Might need to delete the migrations.json file


## Step 4. Compile & Deploy Election Smart Contract
`$ npx truffle migrate --reset --network rinkeby`


## Step 5.  Set up Metamask
Ensure your server is connected to metamask
The network used in Rinkeby Testnet

## Step 6. Run the Front End Application
`$ npm run dev`



