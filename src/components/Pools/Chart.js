import React from "react"
import { ResponsivePie } from '@nivo/pie'
import { tokenList } from "../../helpers/tokenList"
import { web3 } from "../../helpers/init"
import styled from "styled-components";

const Chart = ({ data }) => {
    
    return (
        <ResponsivePie
            data={data.map((item) => ({
                id: tokenList.find(tk => web3.utils.toChecksumAddress(tk.value) === item.address).label,
                label: tokenList.find(tk => web3.utils.toChecksumAddress(tk.value) === item.address).label,
                value: item.percent,
                color: tokenList.find(tk => web3.utils.toChecksumAddress(tk.value) === item.address).color
            }))}
            style={{fontFamily: 'inherit'}}
            margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
            innerRadius={0.35}
            colors={{ datum: 'data.color' }}
            borderWidth={0}
            enableSliceLabels={false}
            radialLabel={d => `${d.label}`}
            radialLabelsTextColor="#CC9966"
            radialLabelsLinkColor={{ from: 'color' }}
            radialLabelsLinkStrokeWidth={2}
            tooltip={value => (
                <Tooltip style={{color: '#CC9966', background: '#444', fontFamily: 'inherit'}}>
                    {value.datum.data.label}: {value.datum.data.value}%
                </Tooltip>)}
        />
    )
}

export default Chart;

const Tooltip = styled.div
`
        display: flex;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        text-decoration: bold;
        padding: 8px;
        border-radius: 4px;
`