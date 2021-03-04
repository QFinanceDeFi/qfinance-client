
import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import {
    initWeb3, INITIAL_STATE, providerOptions
  } from "./IApp";
import AppContext from "./AppContext";
import { getBalance } from "./helpers/getBalance";
import { getPrices } from './helpers/getPrices';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import PoolPage from "./pages/Pool";
import Pools from "./pages/Pools";
import StakePage from "./pages/Stake";
import Trade from "./pages/Trade";
import Layout from "./components/Layout";
import Create from './pages/Create';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const App = () => {
    const [state, setState] = useState(INITIAL_STATE);

    const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions: providerOptions,
        theme: "dark"
      })
    
    useEffect(() => {
        async function prices() {
          const prices: any = await getPrices();
          let qfi = prices.find((item: any) => item.name === "QFinance").price;
          let eth = prices.find((item: any) => item.name === "Ethereum").price;
          setState(s => {
            return {
            ...s,
            priceQFI: qfi ? Number(qfi.toFixed(2)) : 0,
            priceETH: eth ? Number(eth.toFixed(2)) : 0
          }})
        }

        prices()
    }, [])

    const onConnect = async () => {
        const provider: any = await web3Modal.connect().catch(err => console.log(err));
        if (!provider) {
          return
        }
    
        await subscribeProvider(provider);
    
        const web3 = initWeb3(provider);
    
        const accounts = await web3.eth.getAccounts();
    
        const address = accounts[0];
    
        const networkId = await web3.eth.net.getId();
    
        const chainId = await web3.eth.chainId();
    
        const balance = await getBalance(address);
    
        await setState({
          ...state,
          web3,
          provider,
          connected: true,
          address,
          chainId,
          networkId,
          balance,
          fetching: false
        });
      }
    
      const subscribeProvider = async (provider: any) => {
        if (!provider.on) {
          return;
        }
    
        provider.on("close", () => resetApp());
    
        provider.on("accountsChanged", async (accounts: string[]) => {
          setState({...state, fetching: true})
          if (accounts.length === 0) {
            return resetApp();
          }
          await setState({...state, address: accounts[0] });
          onConnect();
        });
    
        provider.on("chainChanged", async (chainId: number) => {
          setState({...state, fetching: true});
          await setState({...state, chainId });
          onConnect();
        });
    
        provider.on("networkChanged", async (networkId: number) => {
          setState({...state, fetching: true});
          await setState({...state, networkId });
          onConnect();
        });
    
        provider.on("disconnect", async () => {
          resetApp();
        })
      }
    
      const resetApp = async () => {
        const { web3 } = state;
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
          await web3.currentProvider.close();
        }
    
        await web3Modal.clearCachedProvider();
        setState({...INITIAL_STATE})
      }
    
      const globalSettings = {
        state,
        onConnect,
        resetApp
      }

      return (
        <AppContext.Provider value={globalSettings}>
        <Router>
        <Layout>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/pool/:address" exact component={PoolPage} />
            <Route path="/pools" exact component={Pools} />
            <Route path="/stake" exact component={StakePage} />
            <Route path="/trade" exact component={Trade} />
            <Route path="/create" exact component={Create} />
          </Switch>
        </Layout>
        </Router>
        </AppContext.Provider>
      )
}

export default App;