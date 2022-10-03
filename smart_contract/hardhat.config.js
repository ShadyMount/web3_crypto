// require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
// https://eth-goerli.g.alchemy.com/v2/qx5jHXRiiEswhYgpLtNF2tQK8Dz-Gl73
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/qx5jHXRiiEswhYgpLtNF2tQK8Dz-Gl73',
      accounts: ['3f82b25d04fa37b2d24327141d651beae1da5c9032347ea9472cd0f02a16a1af']
    }
  }
};
