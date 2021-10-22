const { ethers } = require('hardhat');

const ERC721 = require('@openzeppelin/contracts/build/contracts/ERC721.json');

module.exports = async function listTokensOfOwner({ token: tokenAddress, account }) {
  const token = await ethers.getContractAt(
    ERC721.abi,
    tokenAddress,
    ethers.provider,
  );

  console.error(await token.name(), 'tokens owned by', account);

  const sentLogs = await token.queryFilter(
    token.filters.Transfer(account, null),
  );
  const receivedLogs = await token.queryFilter(
    token.filters.Transfer(null, account),
  );

  const logs = sentLogs.concat(receivedLogs)
    .sort(
      (a, b) =>
        a.blockNumber - b.blockNumber ||
        a.transactionIndex - b.TransactionIndex,
    );

  const owned = new Set();

  for (const log of logs) {
    const { from, to, tokenId } = log.args;
    
    if (addressEqual(to, account)) {
      owned.add(tokenId.toString());
    } else if (addressEqual(from, account)) {
      owned.delete(tokenId.toString());
    }
  }

  console.log([...owned].join('\n'));
};

function addressEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}
