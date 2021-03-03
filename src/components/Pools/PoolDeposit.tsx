import React, { useState, useEffect } from "react";
import AppContext from "../../AppContext";
import Modal from "../Modal/Modal";
import { depositEth } from "../../helpers/depositEth";
import Input from "../Input/Input";
import cogoToast from "cogo-toast";

interface IDepositProps {
    poolName: string;
    address: string;
    isPublic: boolean;
    open: boolean;
    close: any;
    update: Function;
}

const PoolDeposit = ({ poolName, address, isPublic, update, open, close}: IDepositProps) => {
    const [depositAmount, setDepositAmount] = useState<string> ('0');
    const [ethBalance, setEthBalance] = useState<number | undefined> ();

    const context = React.useContext(AppContext);

    const makeDeposit = async () => {
        let res = await depositEth(context, depositAmount, !isPublic, address);
        close();
        if (!res) {
            cogoToast.error('Error making transaction!', {position: "bottom-right"});
        }
        if (res) {
            cogoToast.success('Transaction submitted!', {position: "bottom-right"});
            update();
        }
    }

    useEffect(() => {
        async function getData() {
            if (context.state.web3) {
                let res = await context.state.web3.eth.getBalance(context.state.address);
                let balance = Number(context.state.web3.utils.fromWei(res, 'ether'));
                balance = Math.floor(balance * 10000) / 10000;
                setEthBalance(balance);                
            } else {
                setEthBalance(0);
            }

        }
        getData();
    }, [context])

    return (
        <Modal open={open} close={close} action={makeDeposit}>
            <h2 style={{marginBottom: '36px'}}>
                Deposit ETH
            </h2>
            <Input placeholder='Deposit ETH' variant='primary' size='lg' onChange={e => setDepositAmount(e.target.value)} />
            <h5>Wallet Balance: {ethBalance} ETH</h5>
        </Modal>
    )
}

export default PoolDeposit;