import React from "react";
import styled from "styled-components";
import "./checkbox.css";

interface ICheckboxProps {
    label: string;
    checked: boolean;
    size?: 'sm' | 'lg' | 'auto';
    style?: any;
    onChange: Function;
}

const Checkbox = ({label, checked, style, onChange}: ICheckboxProps) => {
    return (
        <div style={{display: 'flex', alignContent: 'center', padding: '12px'}}>
        <label className="container">
            {label}
            <input type="checkbox" checked={checked} onChange={e => onChange(e)} />
            <span className="checkmark"></span>
        </label>
        </div>
    )
}

export default Checkbox;