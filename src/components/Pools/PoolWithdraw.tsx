import React, { useState, useEffect } from "react";
import AppContext from "../../AppContext";
import Slider from "react-input-slider";
import Modal from "../Modal/Modal";
import { withdrawEth } from "../../helpers/withdrawEth";
import Input from "../Input/Input";
import cogoToast from "cogo-toast";

interface IWithdrawProps {
    poolName: string;
    address: string;
    isPublic: boolean;
    open: boolean;
    close: any;
    update: Function;
}

const PoolWithdraw = ({ poolName, address, isPublic, open, close, update}: IWithdrawProps) => {
    const [withdrawPercent, setWithdrawPercent] = useState<number> (0);
    
    const context = React.useContext(AppContext);

    const makeWithdrawal = async () => {
        let res = await withdrawEth(context, withdrawPercent, !isPublic, address);
        close();
        if (!res) {
            cogoToast.error('Error making transaction', {position: 'bottom-right'});
        }
        if (res) {
            cogoToast.success('Transaction submitted!', {position: 'bottom-right'});
            update();
        }
        return
    }

    return (
        <Modal open={open} close={close} action={makeWithdrawal}>
            <h3 style={{marginBottom: '36px'}}>
                Withdraw ETH from {poolName}
            </h3>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Slider
                    axis='x' x={withdrawPercent} xmin={1} xmax={100}
                    onChange={({x}) => setWithdrawPercent(x)} styles={{track: {backgroundColor: "#666"}, active: {backgroundColor: "#CC9966"}}}
                    />
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <h3>Withdrawal percent: <span style={{color: "#CC9966"}}>{withdrawPercent}%</span></h3>
            </div>
        </Modal>
    )
}

export default PoolWithdraw;