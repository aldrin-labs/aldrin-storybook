const solana = require("@solana/web3.js");
const Markets = require("./markets.json");
const Tokens = require("./tokens.json");

const AWESOME_MARKETS = Markets.map(market => {
  return {
    address: new solana.PublicKey(market.address),
    name: market.name,
    programId: new solana.PublicKey(market.programId),
    deprecated: market.deprecated
  };
});

const AWESOME_TOKENS = Tokens.map(token => {
  return {
    name: token.name,
    address: new solana.PublicKey(token.address)
  };
})

const FILTRED_DEPRECATED_AWESOME_MARKETS = AWESOME_MARKETS.filter(el => !el.deprecated)

export {
  FILTRED_DEPRECATED_AWESOME_MARKETS as AWESOME_MARKETS,
  AWESOME_TOKENS,
}