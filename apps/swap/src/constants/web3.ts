import { ChainId } from "@icpswap/constants";

export const chain: ChainId = ChainId.SEPOLIA;

export const ETH_MINT_CHAIN = 1;

export const DEFAULT_CHAIN_ID = 1;

export const SUPPORTED_CHAINS = [ChainId.MAINNET, ChainId.SEPOLIA];

export const chainIdToNetwork: { [network: number]: string } = {
  1: "Ethereum mainnet",
  3: "ropsten",
  4: "rinkeby",
  42: "kovan",
  97: "chapel", // BSC Testnet
  137: "polygon", // Polygon Mainnet
  80001: "mumbai", // Polygon Testnet
  43114: "avalanche", // Avalanche Mainnet
  43113: "fuji", // Avalanche Testnet
  11155111: "sepolia", // testnet
};

export const EXPLORER_MAPS = {
  [ChainId.MAINNET]: `https://etherscan.io/address`,
  [ChainId.SEPOLIA]: `https://sepolia.etherscan.io/address`,
};
