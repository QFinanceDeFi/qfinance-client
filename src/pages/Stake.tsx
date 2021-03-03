import React from "react";
import Stake from "../components/Stake/Stake";

const StakePage = () => {
    return (
        <div style={{margin: '12px'}}>
            <h2>
                Stake your tokens
            </h2>
            <h4>
                Join one of the staking pools and earn QFI
            </h4>
            <Stake />
        </div>
    )
}

export default StakePage;