import React from "react";
import Chart from "./Chart";
import styled from "styled-components";
import AppContext from "../../AppContext";
import PoolDeposit from "./PoolDeposit";
import PoolWithdraw from "./PoolWithdraw";
import Button from "../Button/Button";

export interface IPoolState {
    poolName: string;
    creator: string;
    address: string;
    currentValue: number;
    isPublic: boolean;
    breakdown: IBreakdown[];
    update: Function;
    userBalance?: number;
}

export interface IBreakdown {
    address: string;
    percent: number;
}

const PoolCard = ({ poolName, address, currentValue, isPublic, breakdown, update, creator, userBalance }: IPoolState) => {
    const [depositFormOpen, setDepositFormOpen] = React.useState<boolean> (false);
    const [withdrawFormOpen, setWithdrawFormOpen] = React.useState<boolean> (false);

    const context = React.useContext(AppContext);

    const closeDepositForm = () => setDepositFormOpen(false);
    const closeWithdrawForm = () => setWithdrawFormOpen(false);

    return (
        <div className="card" style={{textAlign: 'center', justifyContent: 'center', alignContent: 'center'}}>
            <h1 className="card_h1">
                {poolName}
            </h1>
            <h5 className="card_h5" style={{fontWeight: 400}}>
                {address}
            </h5>
            <h4 className="card_h4" style={{margin: '18px 0 8px 0'}}>
                Pool Value: {Math.floor(currentValue * 10000) / 10000} ETH
            </h4>
            <h6 className="card_h6" style={{color: '#CC9966'}}>
                Your value: {userBalance ? Math.floor(userBalance * 10000) / 10000 : 0}
            </h6>
            <PoolGraph>
                {breakdown.length > 0 && <Chart data={breakdown} />}
            </PoolGraph>
            <div style={{display: 'flex', justifyContent: 'center', width: '100%', margin: '18px 0'}}>
                <Button variant="primary" size="sm"
                    onClick={() => setDepositFormOpen(true)} label="Deposit"
                    style={{marginRight: '18px'}} disabled={!isPublic && context.state.address !== creator} />
                <Button variant="primary" size="sm"
                    onClick={() => setWithdrawFormOpen(true)} label="Withdraw"
                    style={{marginLeft: '18px'}} disabled={userBalance < 0.1} />
            </div>
            <PoolDeposit update={update} open={depositFormOpen} close={closeDepositForm}
                isPublic={isPublic} address={address} poolName={poolName} />
            <PoolWithdraw update={update} open={withdrawFormOpen} close={closeWithdrawForm}
                isPublic={isPublic} address={address} poolName={poolName} />
        </div>
    )
}

export default PoolCard;

const PoolGraph = styled.div
`
    align-self: center;
    height: 280px;
    width: 100%;
`