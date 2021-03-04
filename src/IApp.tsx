import Web3 from "web3";
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";
// @ts-ignore
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import Portis from "@portis/web3";

interface IAppState {
    fetching: boolean;
    address: string;
    web3: any;
    provider: any;
    connected: boolean;
    chainId: number;
    networkId: number;
    showModal: boolean;
    pendingRequest: boolean;
    result: any | null;
    balance: number;
    priceQFI: string;
    priceETH: string;
  }

export interface ITransactionState {
    listening: boolean,
    type: 'approve' | 'stake' | 'deposit' | null,
    status: 'processing' | 'success' | 'failed' | null
}
  
export const INITIAL_STATE: IAppState = {
    fetching: false,
    address: "",
    web3: null,
    provider: null,
    connected: false,
    chainId: 1,
    networkId: 1,
    showModal: false,
    pendingRequest: false,
    result: null,
    balance: 0,
    priceQFI: '0',
    priceETH: '0'
  };

export function initWeb3(provider: any) {
    const web3: any = new Web3(provider);
  
    web3.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          outputFormatter: web3.utils.hexToNumber
        }
      ]
    });
  
    return web3;
  }

export const providerOptions =  {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURAID
    }
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: process.env.REACT_APP_FORTMATIC
    }
  },
  torus: {
    package: Torus
  },
  authereum: {
    package: Authereum
  },
  portis: {
    package: Portis,
    options: {
      id: process.env.REACT_APP_PORTIS
    }
  }
}