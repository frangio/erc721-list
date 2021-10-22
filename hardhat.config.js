const { lazyFunction } = require('hardhat/plugins');

require('@nomiclabs/hardhat-ethers');

task('erc721-list', 'List tokens owned by an account')
  .addPositionalParam('token', 'Address of ERC721 token')
  .addPositionalParam('account', 'Account whose owned tokens will be listed')
  .setAction(lazyFunction(() => require('./list')));

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  defaultNetwork: 'mainnet',
  networks: {
    mainnet: {
      url: 'https://mainnet.infura.io/v3/75d50d7bbf614c88b312a16a49ceda96',
    },
  },
};
