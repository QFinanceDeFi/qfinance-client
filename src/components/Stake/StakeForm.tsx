import React, { useState, useContext } from "react";
import Slider from "react-input-slider";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { sendStake } from "../../helpers/getStakingDetails";
import AppContext from "../../AppContext";
import cogoToast from "cogo-toast";

interface IFormProps {
    open: boolean;
    close: any;
    title: string;
    balance: any;
    contract: string;
    allowance: any;
    update: Function;
}

const StakeForm = ({ open, close, title, balance, allowance, contract, update}: IFormProps) => {
    const [amount, setAmount] = useState<number> (0);

    const context = useContext(AppContext);

    const stakeTokens = async () => {
        let staked = await sendStake(context.state, contract, Math.floor(balance * 100000000) / 100000000);
        close();
        if (!staked) {
            cogoToast.error('Error making transaction', {position: 'bottom-right'});
        }
        if (staked) {
            cogoToast.success('Transaction submitted', {position: 'bottom-right'});
            update();
        }
    }

    return (
        <Modal open={open} close={close} action={stakeTokens}>
            <h2>{title}</h2>
            <h3>Stake to earn QFI</h3>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '36px 0'}}>
            <h5>Select stake amount</h5>
                <Slider
                    axis='x' x={amount} xmin={0} xmax={Math.floor(allowance * 100000000) / 100000000}
                    onChange={({x}) => setAmount(x)} styles={{track: {backgroundColor: "#666"}, active: {backgroundColor: "#CC9966"}}}
                    />
            </div>
            <div style={{display: 'flex', margin: '24px', justifyContent: 'space-around'}}>
                <Button variant='primary' size="sm" onClick={() => setAmount(Math.floor(allowance * 100000000) / 100000000 / 4) } label="25%" />
                <Button variant='primary' size="sm" onClick={() => setAmount(Math.floor(allowance * 100000000) / 100000000 / 2) } label="50%" />
                <Button variant='primary' size="sm" onClick={() => setAmount(Math.floor(allowance * 100000000) / 100000000 * 0.75) } label="75%" />
                <Button variant='primary' size="sm" onClick={() => setAmount(Math.floor(allowance * 100000000) / 100000000)} label="Max" />
            </div>
            <div style={{display: 'flex', margin: '24px', justifyContent: 'center'}}>
                <h4>Stake amount: <span style={{color: '#CC9966'}}>{amount}</span></h4>
            </div>
        </Modal>
    )
}

export default StakeForm;