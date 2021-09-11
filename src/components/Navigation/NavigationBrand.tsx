import React from "react";
import logo from "../../assets/images/logo192.png";

const NavigationBrand: React.FC = () => {
    return (
        <div className="nav-brand">
            <div className="nav-image">
                <img src={logo} alt="qfi logo" width="32px" />
            </div>
            <div className="nav-label">
                <span>QFinance</span>
            </div>
        </div>
    );
}

export default NavigationBrand;