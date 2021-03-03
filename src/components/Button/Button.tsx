import React from "react";
import styled from "styled-components";

interface IButtonProps {
    variant: 'primary' | 'secondary';
    size: 'sm' | 'lg' | 'auto',
    label?: string;
    disabled?: boolean;
    onClick?: any;
    style?: any;
}

const Button = ({variant, size, label, disabled, onClick, style}: IButtonProps) => {
    return (
        <StyledButton variant={variant} size={size} disabled={disabled ? true : false} onClick={onClick} style={style}>
            {label}
        </StyledButton>
    )
}

export default Button;

const getBorder = (variant: 'primary' | 'secondary', disabled?: boolean) => {
    if (disabled) return '1px solid #666';
    if (variant === 'primary') {
        return '1px solid #CC9966';
    } else if (variant === 'secondary') {
        return '1px solid transparent';
    }
}

const getColor = (variant: 'primary' | 'secondary', disabled?: boolean) => {
    if (disabled) return '#666';
    if (variant === 'primary') {
        return '#CC9966';
    } else if (variant === 'secondary') {
        return 'black';
    }
}

const getBackground = (variant: 'primary' | 'secondary', disabled?: boolean) => {
    if (disabled) return 'none';
    if (variant === 'primary') {
        return 'black';
    } else if (variant === 'secondary') {
        return '#CC9966';
    }
}

const getBoxShadow = (variant: 'primary' | 'secondary', disabled?: boolean) => {
    if (disabled) return '0';
    if (variant === 'primary') {
        return '0 0 8px 0 #888';
    } else if (variant === 'secondary') {
        return '0 0 8px 0 #CC9966';
    }
}

const getWidth = (size: 'sm' | 'lg' | 'auto') => {
    if (size === 'sm') {
        return '84px';
    } else if (size === 'lg') {
        return '128px';
    } else if (size === 'auto') {
        return 'auto';
    }
}

const StyledButton = styled.button<IButtonProps>
`
    outline: none;
    border: ${props => getBorder(props.variant, props.disabled)};
    border-radius: 6px;
    background: ${props => getBackground(props.variant, props.disabled)};
    color: ${props => getColor(props.variant, props.disabled)};
    padding: 6px 8px;
    margin: 4px;
    width: ${props => getWidth(props.size)};
    font-family: inherit;
    letter-spacing: 0.5px;

    &:hover {
        box-shadow: ${props => getBoxShadow(props.variant, props.disabled)};
        cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    }

    &:active {
        font-size: 14px;
    }
`