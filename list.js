const { ethers } = require('hardhat');

const ERC721 = require('@openzeppelin/contracts/build/contracts/ERC721.json');

async function listTokensOfOwner(tokenAddress, account) {
  const token = await ethers.getContractAt(
    ERC721.abi,
    tokenAddress,
    ethers.provider,
  );

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
        a.transactionIndex - b.transactionIndex,
    );

  const owned = new Set();

  for (const { args: { from, to, tokenId } } of logs) {
    if (addressEqual(to, account)) {
      owned.add(tokenId.toString());
    } else if (addressEqual(from, account)) {
      owned.delete(tokenId.toString());
    }
  }

  return owned;
};

function addressEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

async function getTokenName(tokenAddress) {
  const token = await ethers.getContractAt(
    ERC721.abi,
    tokenAddress,
    ethers.provider,
  );

  return token.name();
}

module.exports = async function ({ token, account }) {
  console.error(await getTokenName(token), 'tokens owned by', account);
  const owned = await listTokensOfOwner(token, account);
  console.log([...owned].join('\n'));
};
