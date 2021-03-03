import React from "react";
import styled from "styled-components";

interface IInputProps {
    placeholder: string;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'lg' | 'auto';
    style?: any;
    onChange: Function;
}

const Input = ({placeholder, variant, size, onChange, style}: IInputProps) => {
    return (
        <StyledInput variant={variant} width={size} placeholder={placeholder} onChange={e => onChange(e)} style={style} />
    )
}

export default Input;

const getColor = (variant: string) => {
    if (variant === 'primary') {
        return '0.5px solid #CC9966'
    } else if (variant === 'secondary') {
        return '0.5px solid #666'
    }
}

const getWidth = (size: string) => {
    if (size === 'sm') {
        return '128px'
    } else if (size === 'lg') {
        return '100%'
    } else {
        return 'auto'
    }
}

const StyledInput = styled.input<IInputProps>
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
`