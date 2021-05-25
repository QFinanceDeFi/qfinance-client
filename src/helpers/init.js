import IERC20 from "./IERC20.json";
import factoryContract from "./QPoolFactory.json";
import poolContract from "./QPool.json";
import publicPoolContract from "./QPoolPublic.json";
import rewardsContract from "./QPoolRewards.json";
import userAirdropContract from "./QUserAirdrop.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const web3 = createAlchemyWeb3(
  process.env.REACT_APP_WEB3API,
);
const FACTORY_ADDRESS = '0xA1EDD4e98e353cAD59ab080Ca25E1b856BC5E30b'
const QFI = new web3.eth.Contract(IERC20.abi, '0x6fE88a211863D0d818608036880c9A4b0EA86795');
const factory = new web3.eth.Contract(factoryContract.abi, FACTORY_ADDRESS);

const airdrop = new web3.eth.Contract(userAirdropContract, '0xaad3f80735ef18a20ce2a07369a06c9004107e5a');

const makeContract = (priv, address) => {
    if (priv) {
        return new web3.eth.Contract(poolContract.abi, address);
    } else if (!priv) {
        return new web3.eth.Contract(publicPoolContract.abi, address);
    }
    
}

const makeStakingContract = (address) => {
    return new web3.eth.Contract(rewardsContract.abi, address);
}

const makeTokenContract = (address) => {
    return new web3.eth.Contract(IERC20.abi, address);
}

export { web3, QFI, factory, airdrop, FACTORY_ADDRESS, makeContract, makeStakingContract, makeTokenContract };