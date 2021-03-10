import React from "react";
import Navbar from "./Navbar";
import NavLink from "./NavLink";
import ExLink from "./ExLink";
import Sidebar from "./Sidebar";
import Price from "./Price";
import BottomBar from "./BottomBar";
import AppContext from "../../AppContext";
import image from "../../images/logo192.png";
import { SiTelegram, SiReddit, SiGithub, SiTwitter, SiInternetexplorer } from "react-icons/si";
import Loader from "react-loader-spinner";

const Navigation = () => {
    const [price, setPrice] = React.useState<number | null> ();

    const context = React.useContext(AppContext);

    React.useEffect(() => {
        function getPrice() {
            setPrice(context.state.priceQFI);
        }
        if (context) {
            getPrice();
        }
    }, [context])

    const navigate = (url: string) => {
        window.location.assign(url);
    }

    return (
        <>
        <Navbar>
            <div className="top-image">
                <img src={image} alt="Q" width='48px' height='48px'/>
            </div>
            <div>
                <NavLink to="/" label="Home" />
                <NavLink to="/pools" label="Pools" />
                <NavLink to="/stake" label="Stake" />
                <NavLink to="/trade" label="Trade" />
            </div>
        </Navbar>
        <Sidebar>
            <div className="side-content">
                <div className="side-image">
                    <img src={image} alt="Q" width='72px' height='72px' />
                </div>
                <NavLink to="/" label="Home" />
                <NavLink to="/pools" label="Pools" />
                <NavLink to="/stake" label="Stake" />
                <NavLink to="/trade" label="Trade" />
            </div>
            <div className="side-content">
                <ExLink href="https://reddit.com/r/QFinanceDeFi" label="Reddit" />
                <ExLink href="https://t.me/QFinance_DeFi" label="Telegram" />
                <ExLink href="https://github.com/QFinanceDeFi" label="Github" />
                <ExLink href="https://qfihub.com" label="Site" />
                {!price ? <Loader type="ThreeDots" color="#CC9966" height="24px" width="24px" />
                :
                <Price price={price} />
                }
            </div>
        </Sidebar>
        <BottomBar>
            <SiTelegram size={24} onClick={() => navigate('https://t.me/QFinance_DeFi')} />
            <SiTwitter size={24} onClick={() => navigate('https://twitter.com/QFinanceDefi')} />
            <SiReddit size={24} onClick={() => navigate('https://reddit.com/QFinanceDefi')} />
            <SiGithub size={24} onClick={() => navigate('https://github.com/QFinanceDeFi')} />
            <SiInternetexplorer size={24} onClick={() => navigate('https://qfihub.com')} />
        </BottomBar>
        </>
    )
}

export default Navigation;