import React from "react";

interface IHeaderProps {
    header: string;
    subheader: string;
}

const Headers = ( {header, subheader}: IHeaderProps) => {
    return (
        <div className="headers">
            <h1 className="header">
                {header}
            </h1>
            <h3 className="subheader">
                {subheader}
            </h3>
        </div>
    )
}

export default Headers;