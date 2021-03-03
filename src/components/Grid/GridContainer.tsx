import React from "react";
import styled from "styled-components";

const GridContainer = ({ children }: any) => {
    return (
        <Container>
            {children}
        </Container>
    )
}

export default GridContainer;

const Container = styled.div
`
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
`