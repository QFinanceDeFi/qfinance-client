import React from "react";
import "./toggle.css";

interface IToggleProps {
    selected: number;
    update: Function;
    items: string[];
}

const Toggle: React.FC<IToggleProps> = ({ selected, update, items }) => {

    return (
        <div className="toggle-nav">
            {items.map((item: string, index: number) => (
                <div className={`toggle-nav-item ${selected === index + 1 && `toggle-nav-item-selected`}`} onClick={() => update(index + 1)} key={index}>
                    <span>{item}</span>
                </div>                    
            ))}
        </div>
    )
}

export default Toggle;