import React from "react";
import styled from "styled-components";

type IMainProps = {
    title: string;
    subtitle?: string;
    children: any;
}

const Main: React.FC<IMainProps> = ({ children, title, subtitle }) => {

    return (
        <MainPage>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <h1 style={{margin: '8px 2.5%', fontSize: '32px'}}>{title}</h1>
                {subtitle && <h2 style={{margin: '4px 2.5%', fontSize: '18px'}}>{subtitle}</h2>}
            </div>
            {children}
        </MainPage>
    )
}

export default Main;

const MainPage = styled.div
`
    padding: 24px;
    display: flex;
    flex-direction: column;
`