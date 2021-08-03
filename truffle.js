const { mnemonic } = require('./secret.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/152ce57163154c3eb74ae1fcc2c07c78`),
      network_id: 4,       
      gas: 5500000,
      confirmations: 0,
      timeoutBlocks: 2000,
      skipDryRun: true,
      networkCheckTimeout: 1000000       
    },
  },
  compilers: {
    solc: {
      version: "0.4.20",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
};