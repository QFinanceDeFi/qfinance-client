export interface IPoolDetails {
    poolName: string;
    endTime: number;
    address: string;
    totalRewards: string;
    rewards?: string;
    balance?: string;
    staked?: string;
    description: string;
    stakingToken: string;
    apy?: string;
}

export const pools: IPoolDetails[] = [
    {
        poolName: 'WBTC QPDT Pool',
        endTime: 1642734405,
        address: '0x725F7F1AeBA0c542be98a32611827D3372be1198',
        totalRewards: '50000000000000000000000',
        stakingToken: "0xb545E7f9835323fCd20Da3992EAa30ED7DD2608d",
        description: `Deposit ETH to the WBTC asset pool and stake the QPDT tokens you get in return.`
    },
    {
        poolName: 'DEXes QPDT Pool',
        endTime: 1616470794,
        address: '0xAe378357B3cEb6ECB236990011Ba90516e14d8E7',
        totalRewards: '5000000000000000000000',
        stakingToken: "0xb68aa08D5ea0dA08cCC87Cf4E1d12F91d46ebFaf",
        description: `Deposit ETH to the DEXes asset pool and stake the QPDT tokens you get in return.`
    },
    {
        poolName: 'QFI-ETH LP Pool',
        endTime: 1705807205,
        address: '0x25ccB404049bce1f200AAf2EA6cc2202A15B6286',
        totalRewards: '300000000000000000000000',
        stakingToken: "0xB6dd4a1AdC8604CCda62c7bA92410d81647B2D61",
        description: `Provide liquidity to the QFI-ETH Uniswap liquidity pool
        and stake your LP tokens here.`
    },
    {
        poolName: 'QFI Pool',
        endTime: 1705804273,
        address: '0x88f11399FA461285D857Bb6BEEae56cC58dcbdf0',
        totalRewards: '100000000000000000000000',
        stakingToken: "0x6fE88a211863D0d818608036880c9A4b0EA86795",
        description: `Earn rewards on your staked QFI and let your investment grow.`
    }
]