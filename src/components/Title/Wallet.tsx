import React from "react";
import styled from "styled-components";

interface WalletProps {
    connected: boolean;
    onConnect: Function;
    disconnect: Function;
}

interface IndicatorProps {
    connected: boolean
}

const Wallet = ( {connected, onConnect, disconnect}: WalletProps) => {
    return (
        <>
        <div className="wallet" onClick={() => onConnect()}>
            <span className="wallet_span">
                {connected ? "Connected" : "Connect"}
            </span>
            <Indicator connected={connected} />
        </div>
        {connected &&
        <div className="disconnect" onClick={() => disconnect()}>
            Disconnect
        </div>
        }
        </>
    )
}

export default Wallet;

const Indicator = styled.div<IndicatorProps>
`
    border-radius: 45px;
    background: ${props => props.connected ? 'green' : 'red'};
    height: 8px;
    width: 8px;
`