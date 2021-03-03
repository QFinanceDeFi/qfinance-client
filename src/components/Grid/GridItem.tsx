import React from "react";
import styled from "styled-components";

interface IGridProps {
    lg?: number;
    sm?: number;
    gap?: number;
    shadow?: boolean;
    style?: object;
    children: any;
}

const GridItem = ({ sm, lg, gap, shadow, style, children }: IGridProps) => {
    return (
        <Grid sm={sm} lg={lg}>
            <GridContent gap={gap} shadow={shadow} style={style}>
                {children}
            </GridContent>
        </Grid>
    )
}

export default GridItem;

const Grid = styled.div<IGridProps>
`
    width: 50%;
    border-radius: 8px;
    @media (max-width: 768px) {
        width: 100%;
    }
`

const GridContent = styled.div<IGridProps>
`
    display: flex;
    flex-direction: column;
    align-content: center;
    text-align: center;
    border-radius: 8px;
    box-shadow: ${props => props.shadow ? '0 0 4px 0 #444' : '0'};
    padding: ${props => props.gap ? `${props.gap}px` : 0}
`