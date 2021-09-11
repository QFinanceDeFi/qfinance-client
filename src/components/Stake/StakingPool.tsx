import React from "react";
import Loader from "react-spinners/ClipLoader";
import { web3 } from "../../data/init";
import { useAppDispatch, useAppSelector } from "../../hooks/base";
import { getStakingInfo } from "../../state/stake/stake";
import { approveToken, getRewards, setTarget, stakeToken, withdrawStake } from "../../state/tx/tx";
import "./stake.css";

type IStakingPoolProps = {
    poolName: string;
    endTime: number;
    address: string;
    totalRewards: string;
    description: string;
    stakingToken: string;
}

const StakingPool: React.FC<IStakingPoolProps> = ({ poolName, endTime, address, description, totalRewards, stakingToken }) => {
    const { details, tx } = useAppSelector(state => {
        return {
            details: state.stake.pools.find(p => p.address === address),
            tx: state.tx
        }
    });


    const dispatch: any = useAppDispatch();

    async function approve() {
        dispatch(setTarget(address));
        try {
            dispatch(await approveToken({poolAddress: address, address: stakingToken, amount: details?.balance ?? '0'}));
            dispatch(await getStakingInfo)
        }
        catch {
            dispatch(setTarget(''));
        }
    }

    async function stake() {
        dispatch(setTarget(address));
        try {
            dispatch(await stakeToken({address, amount: details?.allowance ?? '0'}));
            dispatch(await getStakingInfo());
        }
        catch {
            dispatch(setTarget(''));
        }
    }

    async function claim() {
        dispatch(setTarget(address));
        try {
            dispatch(await getRewards({address}));
            dispatch(await getStakingInfo());
        }
        catch {
            dispatch(setTarget(''));
        }
    }

    async function withdraw() {
        dispatch(setTarget(address));
        try {
            dispatch(await withdrawStake({address, amount: details?.staked ?? '0'}));
            dispatch(await getStakingInfo());
        }
        catch {
            dispatch(setTarget(''));
        }
    }

    return (
        <div className="staking-card">
            <div className="staking-card-content">
                <div className="staking-card-header">
                    <span style={{margin: 0, fontSize: '14px', display: 'block', color: "#BA9860"}}>
                        APY: {new Date(endTime * 1000) > new Date() ? details?.apy ?? '0': '---'}%
                    </span>
                    <span style={{margin: 0, fontSize: '14px', display: 'block'}}>
                        Ends: {new Date(endTime * 1000).toLocaleDateString()}
                    </span>   
                </div>
                <div style={{margin: '12px 0', display: 'flex', fontSize: '14px', justifyContent: 'center'}}>
                    <h3 style={{margin: 0, display: 'block'}}>{poolName}</h3>
                </div>
                <div style={{fontSize: '14px', minHeight: '56px', margin: '4px 0', textAlign: 'center'}}>
                    {description}
                </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                        Balance: {Number(web3.utils.fromWei(details?.balance ?? '0', 'ether')).toLocaleString()}
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', alignItems: 'center', margin: '8px 0'}}>
                        <span style={{fontSize: '14px', marginBottom: '4px'}}>
                            Claim: {Number(web3.utils.fromWei(details?.rewards ?? '0', 'ether')).toLocaleString()}
                        </span>
                        <button className={`staking-card-button ${(new Date(endTime * 1000) < new Date() || Number(details?.rewards ?? 0) === 0) && `button-disabled`}`}
                        onClick={claim}
                        disabled={Number(details?.rewards ?? 0) === 0}>
                            <span style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {tx.status === 'pending' && tx.current === 'claim' && tx.target === address && <Loader size="12px" color="#BA9860" />}
                            <span style={{marginLeft: '4px'}}>Claim</span>
                        </span>
                        </button>
                    </div> 
                    <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', alignItems: 'center', margin: '8px 0'}}>
                        <span style={{fontSize: '14px', marginBottom: '4px'}}>
                            Staked: {Number(web3.utils.fromWei(details?.staked ?? '0', 'ether')).toFixed()}
                        </span>
                        <button className={`staking-card-button ${(new Date(endTime * 1000) < new Date() || Number(details?.staked ?? 0) === 0) && `button-disabled`}`}
                            onClick={withdraw}
                            disabled={Number(web3.utils.fromWei(details?.staked ?? '0', 'ether')) < 0.1}>
                            Withdraw
                        </button>
                    </div>                 
                </div>
            </div>
            <div className="staking-card-bottom">
                <div className="staking-card-rewards">
                    <span style={{fontSize: '14px'}}>{`Rewards: ${Number(totalRewards.slice(0, -18)).toLocaleString()} QFI`}</span>
                </div>
                <div className="staking-card-actions">
                    <button className={`staking-card-button ${(new Date(endTime * 1000) < new Date() || Number(web3.utils.fromWei(details?.balance ?? '0', 'ether')) < 0.01) && `button-disabled`}`}
                        onClick={approve}
                        disabled={new Date(endTime * 1000) < new Date() || Number(web3.utils.fromWei(details?.balance ?? '0', 'ether')) < 0.01}>
                        <span style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {tx.status === 'pending' && tx.current === 'approve' && tx.target === address && <Loader size="12px" color="#BA9860" />}
                            <span style={{marginLeft: '4px'}}>Approve</span>
                        </span>
                    </button>
                    <button className={
                        `${(new Date(endTime * 1000) < new Date()
                            ||
                        (Number(details?.allowance ?? 0) === 0) || Number(details?.balance ?? 0) === 0) ? `staking-card-button button-disabled` : `stake-button`}`}
                        onClick={stake}
                        disabled={new Date(endTime * 1000) < new Date()
                            ||
                        (Number(details?.allowance ?? 0) === 0 || Number(details?.balance ?? 0) === 0)}>
                        Stake
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StakingPool;