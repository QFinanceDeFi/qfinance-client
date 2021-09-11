import React from "react";
import styled from "styled-components";
import useWindowWidth from "../../hooks/useWindowWidth";

type IHomeCardProps = {
    size: 'sm' | 'lg';
    children?: any;
}

type IStyledProps = {
    size: 'sm' | 'lg';
    width: number;
}

const HomeCard: React.FC<IHomeCardProps> = ({ size, children }) => {
    const width = useWindowWidth();

    return (
        <StyledHomeCard width={width} size={size}>
            <div style={{padding: '24px'}}>
                {children}
            </div>
        </StyledHomeCard>
    )

}

export default HomeCard;

function getWidth(width: number, size: 'sm' | 'lg') {
    function widthBySize(size: string, screenSmall: boolean) {
        if (size === 'sm') {
            return screenSmall ? '45%' : '27.5%';
        } else {
            return screenSmall ? '90%' : '45%';
        }
    }
    if (width > 1000) {
        return widthBySize(size, false);
    } else {
        return widthBySize(size, true);
    }
}

const StyledHomeCard = styled.div
`
    display: flex;
    width: ${(props: IStyledProps) => getWidth(props.width, props.size)};
    height: 180px;
    background: rgb(42,42,42);
    flex-grow: 1;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    margin: 12px 2.5%;
    text-align: center;

    &:hover {
        box-shadow: 0 0 2px 1px rgba(42,42,42,0.4);
    }
`