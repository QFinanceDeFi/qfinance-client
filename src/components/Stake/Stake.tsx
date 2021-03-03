import React from "react";
import { IStakingDetails, IStakingData, getStakingDetails } from "../../helpers/getStakingDetails";
import AppContext from "../../AppContext";
import StakeCard from "./StakeCard";
import "./stake.css";
import Loader from "react-loader-spinner";

const stakingContracts: IStakingData[] = [
    {
        name: "WBTC QPDT Staking",
        address: '0x725F7F1AeBA0c542be98a32611827D3372be1198',
        stakingToken: '0xb545E7f9835323fCd20Da3992EAa30ED7DD2608d',
        info: 'To acquire staking tokens, deposit ETH into the WBTC investment pool. \
        You will get QPDTs representing your share of the pool and then stake them here to earn QFI. \
        You must withdraw the tokens from this staking pool before withdraw your ETH from the WBTC pool.'
    },
    {
        name: "DEXes QPDT Staking",
        address: '0xAe378357B3cEb6ECB236990011Ba90516e14d8E7',
        stakingToken: '0xb68aa08D5ea0dA08cCC87Cf4E1d12F91d46ebFaf',
        info: 'To acquire staking tokens, deposit ETH into the DEXes investment pool. \
        You will get QPDTs representing your share of the pool and then stake them here to earn QFI. \
        You must withdraw the tokens from this staking pool before withdraw your ETH from the DEXes pool.'
    },
    {
        name: "QFI-ETH Uniswap LP Staking",
        address: '0x25ccB404049bce1f200AAf2EA6cc2202A15B6286',
        stakingToken: '0xB6dd4a1AdC8604CCda62c7bA92410d81647B2D61',
        info: 'Provide QFI-ETH liquidity to Uniswap and stake your LP tokens to earn QFI.'
    },
    {
        name: "QFI Staking",
        address: '0x88f11399FA461285D857Bb6BEEae56cC58dcbdf0',
        stakingToken: '0x6fE88a211863D0d818608036880c9A4b0EA86795',
        info: 'Stake your QFI tokens directly to earn rewards on your QFI holdings.'
    }
]

const Stake = () => {
    const [state, setState] = React.useState<IStakingDetails[] | undefined>();
    const [loading, setLoading] = React.useState<boolean> (true);
    const [update, setUpdate] = React.useState<boolean> (false);
    const context = React.useContext(AppContext);

    React.useEffect(() => {
        async function get() {
            setLoading(true);
            let res: React.SetStateAction<any> = await getStakingDetails(context, stakingContracts)
            .then((res: any) => {
                return res })
            .catch((e: any) => console.log(e));
            return setState(res);
        }
        get().then(() => setLoading(false));
    }, [context, update])

    const getUpdate = () => setUpdate(true);

    return (
        <div className="stake-grid">
            {loading ?
            <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                <Loader type="ThreeDots" color="#CC9966" height={100} width={100} timeout={7000} />
            </div>
            :
            state && state.map(item => (
                <div className="stake-grid-item" key={item.name}>
                <StakeCard title={item.name} info={item.info} reward={item.totalRewards}
                    apy={item.rewardsPerToken} update={getUpdate} duration={item.duration}
                    deadline={item.periodFinish} userStake={item.userStake} stakingToken={item.stakingToken} address={item.address} />
                </div>
            ))
            }
        </div>
    )
}

export default Stake;