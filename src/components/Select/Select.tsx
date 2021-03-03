import React from "react";
import styled from "styled-components";
import "./select.css";

interface ISelectProps {
    placeholder: string;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'lg' | 'auto';
    style?: any;
    onChange: Function;
    children: any;
}

const Select = ({placeholder, variant, size, children, style, onChange}: ISelectProps) => {
    return (
        <StyledSelect placeholder={placeholder} variant={variant} style={style} onChange={e => onChange(e)}>
            {children}
        </StyledSelect>
    )
}

export default Select;

const getColor = (variant: string) => {
    if (variant === 'primary') {
        return '0.5px solid #CC9966'
    } else if (variant === 'secondary') {
        return '0.5px solid #666'
    }
}

const getWidth = (size: 'sm' | 'lg' | 'auto') => {
    if (size === 'sm') {
        return '128px'
    } else if (size === 'lg') {
        return '100%'
    } else {
        return 'auto'
    }
}

const StyledSelect = styled.select<ISelectProps>
`
    fill: none;
    padding: 12px;
    border: ${props => getColor(props.variant)};
    border-radius: 6px;
    color: #CC9966;
    background: none;
    width: ${props => getWidth(props.size)};

    &:focus {
        outline: none;
        border: ${props => getColor(props.variant)}
        box-shadow: 0 0 12px 0 #CC9966;
    }

    &:hover {
        cursor: pointer;
    }

    & > * {
        background: black;
        color: #CC9966;
    }
`