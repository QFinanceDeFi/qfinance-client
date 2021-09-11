import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnectProvider from "@walletconnect/web3-provider";

const IERC20 = require('./IERC20.json');
const factoryContract = require('./QPoolFactory.json');
const poolContract = require("./QPool.json");
const publicPoolContract = require("./QPoolPublic.json");
const rewardsContract = require("./QRewardsPool.json");

export const web3 = createAlchemyWeb3(`wss://${process.env.REACT_APP_ALCHEMY}`);

export const QFI = "0x6fE88a211863D0d818608036880c9A4b0EA86795";
export const FACTORY_ADDRESS = '0xA1EDD4e98e353cAD59ab080Ca25E1b856BC5E30b';

export const factory = new web3.eth.Contract(factoryContract.abi, FACTORY_ADDRESS);

export const makeContract = (address: string, priv: boolean) => {
    if (priv) {
        return new web3.eth.Contract(poolContract.abi, address);
    } else if (!priv) {
        return new web3.eth.Contract(publicPoolContract.abi, address);
    }
}

export const makeStakingContract = (address: string) => {
    return new web3.eth.Contract(rewardsContract.abi, address);
}

export const makeTokenContract = (address: string) => {
    return new web3.eth.Contract(IERC20.abi, address);
}

export const setProvider = async (service: 'injected' | 'walletconnect') => {

    if (service === 'injected') {
        const provider: any = await detectEthereumProvider();
        
        if (provider) {
            await provider.enable();
        }        
    }
    else if (service === 'walletconnect') {
        const provider: any = new WalletConnectProvider({
            rpc: {
                1: process.env.REACT_APP_ALCHEMY ?? ''
            }
        });

        await provider.enable();

        web3.setWriteProvider(provider);
    }

}