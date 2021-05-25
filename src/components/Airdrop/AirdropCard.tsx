import React from "react";
import styled from "styled-components";

const AirdropCard = ({children}) => {
    return (
        <Card>
            {children}
        </Card>
    );
}

export default AirdropCard;

const Card = styled.div
`
    width: 280px;
    height: 140px;
    margin: 12px;
    border: 1px solid #CC9966;
    border-radius: 8px;
    box-shadow: 0 0 12px 0 grey;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    align-items: center;
`