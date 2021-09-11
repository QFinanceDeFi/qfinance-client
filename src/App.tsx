import detectEthereumProvider from "@metamask/detect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import { web3 } from "./data/init";
import { useAppDispatch, useAppSelector } from "./hooks/base";
import Home from "./pages/Home";
import Pools from "./pages/Pools";
import Stake from "./pages/Stake";
import Swap from "./pages/Swap";
import {
  changeAccount,
  changeChain,
  makeConnection,
} from "./state/connect/connect";
import { getPublicPools, getPrivatePools } from "./state/pools/pools";
import { getPrices } from "./state/price/price";
import { getStakingInfo } from "./state/stake/stake";
import { getWalletData, setWalletState } from "./state/wallet/wallet";
import toast, { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const {connected, address, prices, hashes, pools, stake} = useAppSelector(state => {
    return {
      connected: state.connect.connected,
      address: state.connect.address,
      hashes: state.tx.hashes,
      prices: state.prices,
      pools: state.pools,
      stake: state.stake
    }
  });

  const [tvl, setTVL] = React.useState<string>('0');

  const dispatch = useAppDispatch();

  const connectWallet = async (service: "injected" | "walletconnect") => {
    try {
      if (service === "injected") {
        const provider: any = await detectEthereumProvider();

        if (provider) {
          await provider.enable().catch((e: any) => { throw Error (e)});
          await subscribeProvider(provider, service);
          web3.setWriteProvider(provider);
        } else {
          alert("You need a Web3 wallet installed such as Metamask.");
          return;
        }
      } else if (service === "walletconnect") {
        const provider: any = new WalletConnectProvider({
          rpc: {
            1: "https://eth-mainnet.alchemyapi.io/v2/Xq7ZIBFhdnWOyiZM2ioQj6rfJzoDoDeT",
          },
        });

        await provider.enable();
        await subscribeProvider(provider, service);

        web3.setWriteProvider(provider);
      }

      const accounts: string[] = await web3.eth.getAccounts();
      const networkId: number = await web3.eth.net.getId();
      const chainId: number = await web3.eth.getChainId();

      dispatch(
        makeConnection({
          connected: true,
          address: accounts[0],
          chainId,
          networkId,
        })
      );

      localStorage.setItem('walletprovider', service);

      dispatch(await getWalletData());

    } catch {
      dispatch(
        makeConnection({
          connected: false,
          address: "",
          chainId: 0,
          networkId: 0,
        })
      );
    }
  };

  const subscribeProvider = async (provider: any, service: 'injected' | 'walletconnect') => {
    provider.on("connect", async () => {
      localStorage.setItem('walletprovider', service);
      dispatch(await getWalletData());
    });

    provider.on("disconnect", () => {
        dispatch(
          makeConnection({
            connected: false,
            address: "",
            chainId: 0,
            networkId: 0,
          })
        );

        localStorage.removeItem('walletprovider');
      }
    );

    provider.on("accountsChanged", async (accounts: string[]) => {
      if (accounts.length === 0) {
        return dispatch(
          makeConnection({
            connected: false,
            address: "",
            chainId: 0,
            networkId: 0,
          })
        );
      }
      dispatch(changeAccount(accounts[0]));
      dispatch(await getWalletData());
    });

    provider.on("chainChanged", async (chainId: number) => {
      dispatch(changeChain(chainId));
      dispatch(await getWalletData());
    });
  };

  const notify = (msg: string) => toast(msg);

  React.useEffect(() => {
    async function process() {
      Promise.resolve(dispatch(await getPrices()));
      Promise.resolve(dispatch(await getPublicPools()));
      Promise.resolve(dispatch(await getPrivatePools()));
    }

    if (localStorage.getItem('walletprovider')) {
      const provider: any = localStorage.getItem('walletprovider') ?? '';
      connectWallet(provider !== '' ? provider : 'injected');
      Promise.resolve(process());
    } else {
      Promise.resolve(process());
    }

    // eslint-disable-next-line
  }, [dispatch])

  React.useEffect(() => {
    async function process() {
      dispatch(await getStakingInfo());
    }

    if (Number(prices.qfiPrice) > 0 || Number(prices.ethPrice) > 0) {
      Promise.resolve(process());
    }

  }, [prices.qfiPrice, prices.ethPrice, address, hashes, dispatch])

  React.useEffect(() => {
    async function process() {
      dispatch(await getWalletData());
    }

    if (connected) {
      Promise.resolve(process());
    } else {
      dispatch(setWalletState({qfiBalance: '0', ethBalance: '0'}));
    }
  }, [connected, address, hashes, dispatch])

  React.useEffect(() => {
    if (stake.pools.length > 0) {
      const copy = [...pools.publicPools, ...pools.privatePools];
      const poolValue: any = copy.reduce((a: any, b: any): any => Number(a) + Number(web3.utils.fromWei(b.poolBalance, 'ether')), 0) * prices.ethPrice;
      const stakeValue: any = stake.pools.reduce((a: any, b: any): any => Number(a) + Number(b.valueLocked), 0);

      setTVL((poolValue + stakeValue).toLocaleString('en-US', { style: 'currency', currency: 'USD'}));        
    }
  }, [stake.pools, pools.publicPools, pools.privatePools, prices.ethPrice])

  React.useEffect(() => {
    if (address !== '') {
      web3.eth.subscribe("alchemy_filteredFullPendingTransactions", { address: address }, async (e: Error, tx: any) => {
        console.log(e, tx);
        if (!tx) {
          return;
        } else {
          dispatch(await getWalletData());
          dispatch(await getStakingInfo());
          notify(`Confirmed: ${(<a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank noreferrer">{tx.hash}</a>)}`)
        }
      });      
    }

    return () => web3.eth.clearSubscriptions(() => {});
  });

  return (
    <Router>
      <Switch>
        <>
          <Navigation
            connect={(service: "walletconnect" | "injected") =>
              connectWallet(service)
            }
          />
          <Route path="/" exact={true}>
            <Home tvl={tvl} />
          </Route>
          <Route path="/pools" exact={true}>
            <Pools />
          </Route>
          <Route path="/stake" exact={true}>
            <Stake />
          </Route>
          <Route path="/swap" exact={true}>
            <Swap />
          </Route>
          <Toaster />
        </>
      </Switch>
    </Router>
  );
};

export default App;
