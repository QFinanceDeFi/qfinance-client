import React from "react";
import styled from "styled-components";
import uniswap from "../images/uniswap-logo.png";
import cmc from "../images/cmc.png";

const UNISWAP_LINK = `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x6fe88a211863d0d818608036880c9a4b0ea86795`
const CMC_LINK = `https://coinmarketcap.com/currencies/qfinance/`

const Trade = () => {

    return (
        <>
        <div className="card" style={{padding: '24px', marginBottom: '24px'}}>
            <h1 className="card_h1">
                QFI is trading on Uniswap
            </h1>
            <ImageDiv href={UNISWAP_LINK}>
                <img src={uniswap} alt="Uniswap" width='256px' />
            </ImageDiv>
        </div>
        <div className="card" style={{padding: '24px'}}>
            <h1 className="card_h1">
                QFI on CoinMarketCap
            </h1>
            <ImageDiv href={CMC_LINK}>
                <img src={cmc} alt="CoinMarketCap" width='256px' />
            </ImageDiv>
        </div>
        </>
    )
}

export default Trade;

const ImageDiv = styled.a
`
    width: 256px;
    padding: 12px 0;
    &:hover {
        cursor: pointer;
    }
`