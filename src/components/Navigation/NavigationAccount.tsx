import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/base";
import Modal from "../Modal/Modal";
import metamask from "../../assets/images/metamask.png";
import walletconnect from "../../assets/images/walletconnect.png";
import { web3 } from "../../data/init";
import logo from "../../assets/images/logo192.png";
import ethLogo from "../../assets/images/eth-icon.png";
import Loader from "react-spinners/ClipLoader";
import { reset } from "../../state/connect/connect";
import { Check } from "react-feather";

type INavAccountProps = {
    connect: Function;
}

const NavigationAccount: React.FC<INavAccountProps> = ({ connect }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [modal, setModal] = React.useState<boolean>(false);
    const [txModal, setTxModal] = React.useState<boolean>(false);
    const { connected, address, prices, wallet, tx } = useAppSelector(state => {
        return {
            connected: state.connect.connected,
            address: state.connect.address,
            prices: state.prices,
            wallet: state.wallet,
            tx: state.tx
        }
    });

    const dispatch = useAppDispatch();

    return (
        <>
        <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
        <div className="nav-account" onClick={() => connected ? setOpen(!open) : setModal(!modal)}>
            <div className="nav-tx-tracker">
                {tx.status === 'pending' && <Loader size="18px" color="white" />}
                {tx.status === 'succeeded' && <Check size="18px" color="green" />}
            </div>
            <div className="nav-indicator" style={{background: connected ? 'green' : 'red'}}>
            </div>
            <div className="nav-address">
                {connected ? `${address.slice(0, 5)} ... ${address.slice(-5)}` : `CONNECT NOW`}
            </div>
        </div>
        {modal &&
            <Modal open={modal} close={() => setModal(false)}>
                <div className="connect-modal">
                    <h3 style={{margin: '4px'}}>Connect to QFI Hub</h3>
                    <div className="connect-provider-list">
                        <div className="connect-provider" onClick={async () => { setModal(false); connect('injected') }}>
                            <div style={{width: '48px', display: 'flex', justifyContent: 'center'}}>
                                <img src={metamask} alt="Metamask" width="24px" />
                            </div>
                            <span>Browser Wallet</span>
                        </div>
                        <div className="connect-provider" onClick={async () => { setModal(false); connect('walletconnect') }}>
                        <div style={{width: '48px', display: 'flex', justifyContent: 'center'}}>
                            <img src={walletconnect} alt="WalletConnect" width="32px" />
                        </div>
                            <span>WalletConnect</span>
                        </div>                     
                    </div>
                </div>
            </Modal>
        }
        <div className="nav-account-dropdown" style={{height: open ? '168px' : '0'}}>
            <div className="nav-dropdown-content">
                <div className="account-balances">
                    <div className="account-balance-item">
                        <div style={{width: '40px', display: 'flex', justifyContent: 'center'}}>
                            <img src={logo} alt="qfi icon" width="36px" />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span>
                            {Number(web3.utils.fromWei(wallet.qfiBalance, 'ether')).toLocaleString()} QFI
                            </span>
                            <span style={{fontSize: '12px', color: 'grey', textAlign: 'right'}}>
                                (~{(Number(web3.utils.fromWei(wallet.qfiBalance, 'ether')) * Number(prices.qfiPrice)).toLocaleString('en-US', {style: 'currency', currency: 'USD'})})
                            </span>
                        </div>
                    </div>
                    <div className="account-balance-item">
                    <div style={{width: '40px', display: 'flex', justifyContent: 'center'}}>
                            <img src={ethLogo} alt="qfi icon" height="28px" />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span>
                            {Number(web3.utils.fromWei(wallet.ethBalance, 'ether')).toLocaleString()} ETH
                            </span>
                            <span style={{fontSize: '12px', color: 'grey', textAlign: 'right'}}>
                                (~{(Number(web3.utils.fromWei(wallet.ethBalance, 'ether')) * Number(prices.ethPrice)).toLocaleString('en-US', {style: 'currency', currency: 'USD'})})
                            </span>
                        </div>
                    </div>
                </div>
                <div className="account-actions">
                    <span className="account-action-button" onClick={() => { setOpen(false); dispatch(reset()) }}>
                        Disconnect
                    </span>
                </div>
            </div>
        </div>
        </div>
        {txModal &&
        <Modal open={txModal} close={() => setTxModal(false)}>
        <div className="tx-history-modal">
            <div className="tx-history-header">
                <h3 style={{margin: 0}}>Transactions</h3>
            </div>
            <div className="tx-history-list">
                TX LIST
            </div>
            <div className="modal-action-buttons">
                TEST
            </div>
        </div>
        </Modal>
        }
        </>
    )
}

export default NavigationAccount;