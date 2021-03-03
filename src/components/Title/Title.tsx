import React from "react";
import TitleRow from "./TitleRow";
import Headers from "./Headers";
import Connect from "./Connect";
import Wallet from "./Wallet";
import AppContext from "../../AppContext";
import "./title.css";

const Title = () => {

    const context = React.useContext(AppContext);

    return (
        <TitleRow>
            <Headers header="QFinance DeFi Platform" subheader="Decentralized, DAO-based investment pools" />
            {context &&
            <Connect balance={context.state.balance}>
                <Wallet connected={context.state.connected} onConnect={context.onConnect} disconnect={context.resetApp} />
            </Connect>
            }
        </TitleRow>
    )
}

export default Title;