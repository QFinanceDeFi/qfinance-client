import React from "react";
import StakingPool from "../components/Stake/StakingPool";
import Toggle from "../components/Toggle/Toggle";
import { IPoolDetails, pools } from "../data/stakingPools";

const Stake: React.FC = () => {
    const [selected, setSelected] = React.useState<number>(1);
    
    return (
        <div style={{display: 'flex', justifyContent: 'center', padding: '48px 24px'}}>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, maxWidth: '600px'}}>
                <h1 style={{margin: '4px 0'}}>Staking Pools</h1>
                <h3 style={{margin: '8px 0 12px 0'}}>Stake and earn your QFI, QFI-ETH LP tokens, or QPDTs</h3>
                <Toggle selected={selected} update={(val: number) => setSelected(val)} items={["Active", "Expired"]} />
                {pools.filter(p => selected === 1 ?
                    new Date(p.endTime * 1000) > new Date()
                    :
                    new Date(p.endTime * 1000) < new Date()).map((item: IPoolDetails, index: number) => (
                        <StakingPool key={index} poolName={item.poolName} endTime={item.endTime} address={item.address}
                            stakingToken={item.stakingToken} totalRewards={item.totalRewards} description={item.description} />    
                    ))}
            </div>
        </div>
    )
}

export default Stake;