import React from "react";
import "./navigation.css";

const Navbar = ({children}: any) => {
    return (
        <div className="nav">
            {children}
        </div>
    )
}

export default Navbar;