import React from "react";

interface IConnectProps {
    balance: number;
    children: any;
}

const Connect = ( {balance, children}: IConnectProps) => {
    return (
        <div className="connect">
            <div className="balance">
                QFI: {Math.floor(balance * 10000) / 10000}
            </div>
            {children}
        </div>
    )
}

export default Connect;