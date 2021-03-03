import React from "react"
import { useHistory } from "react-router-dom";
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import AppContext from "../AppContext";
import { FiPieChart, FiAward, FiRefreshCcw } from "react-icons/fi";

const Home = () => {
  const context = React.useContext(AppContext);

  const history = useHistory();

  const navigate = (url: string) => {
    window.location.assign(url);
  }

  return (
    <>
      <h1 style={{marginLeft: '12px', fontWeight: 600, color: '#CC9966'}}>Home</h1>
      <div className="about">
          <p style={{color: '#CC9966'}}>
            QFinance is a decentralized protocol to create Ethereum-based investment pools. Pools have an asset allocation.
            When you deposit your funds to one of the pools, the smart contract code will acquire the assets in a fully
            decentralized manner. Deposit your funds to a pool but keep full control, and withdraw at any time. Then stake to earn QFI.
          </p>
        </div>
      <GridContainer>
        <GridItem sm={2} gap={12}>
            <div className="card" style={{padding: '24px'}}>
              <h2 className="card_h2">${context ? `${context.state.priceQFI}` : 0}</h2>
              <h5 className="card_h5">QFI Price</h5>
            </div>
        </GridItem>
        <GridItem sm={2} gap={12}>
            <div className="card" style={{padding: '24px'}}>
              <h2 className="card_h2">$164,000</h2>
              <h5 className="card_h5">TVL</h5>
            </div>
        </GridItem>
        <div className="features">
          <div className="features_card" onClick={() => history.push(`/pools`)}>
            <FiPieChart size={32} color="white" />
            <h3>Invest in a pool</h3>
          </div>
          <div className="features_card" onClick={() => history.push(`/stake`)}>
            <FiAward size={32} color="white" />
            <h3>Stake to earn QFI</h3>
          </div>
          <div className="features_card" onClick={() => navigate(`https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x6fe88a211863d0d818608036880c9a4b0ea86795`)}>
            <FiRefreshCcw size={32} color="white" />
            <h3>Buy and sell QFI</h3>
          </div>
        </div>
      </GridContainer>
    </>
  )
}

export default Home
