import React from "react";
import Pool from "../components/Pools/Pool";
import Toggle from "../components/Toggle/Toggle";
import { useAppSelector } from "../hooks/base";

const Pools: React.FC = () => {
    const [open, setOpen] = React.useState<number>(-1);
    const [selected, setSelected] = React.useState<number>(1);
    const pools = useAppSelector(state => {
        return {
            status: state.pools.status,
            privatePools: [...state.pools.privatePools].sort((a: any, b: any) => Number(a.poolBalance) < Number(b.poolBalance) ? 1 : -1),
            publicPools: [...state.pools.publicPools].sort((a: any, b: any) => Number(a.poolBalance) < Number(b.poolBalance) ? 1 : -1)
        }
    });

    function update(index: number) {
        setOpen(index);
    }
    
    return (
        <div style={{display: 'flex', justifyContent: 'center', padding: '32px 24px'}}>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, maxWidth: '600px'}}>
                <h1 style={{margin: '4px 0'}}>Asset Pools</h1>
                <h3 style={{margin: '8px 0'}}>Browse and create asset pools</h3>
                <span style={{margin: '0 0 24px 0'}}>
                    Please note: Creating pools is currently disabled as QFinance V2 will be launching soon. We recommend waiting
                    for V2 pools before depositing funds as there will be new features and substantial cost savings.
                </span>
                <Toggle selected={selected} update={(val: number) => { setOpen(-1); setSelected(val) }} items={["Public", "Private"]} />
                {pools.status !== 'failed' && selected === 1 &&
                    pools.publicPools.map((pool: any, index: number) => (
                        <Pool poolName={pool.poolName} value={pool.poolBalance} address={pool.address} isPublic={true} key={pool.address} index={index} update={update} open={open === index} />
                    ))
                }
                {pools.status !== 'failed' && selected === 2 &&
                    pools.privatePools.map((pool: any, index: number) => (
                        <Pool poolName={pool.poolName} value={pool.poolBalance} address={pool.address} isPublic={false} key={pool.address} index={index} update={update} open={open === index} />
                    ))
                }
            </div>
        </div>
    )
}

export default Pools;