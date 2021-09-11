import React from "react";
import { NavLink } from "react-router-dom";

type INavLinkProps = {
    text: string;
    link: string;
}

const NavigationLink: React.FC<INavLinkProps> = ({ text, link }) => {
    return (
        <NavLink to={link} exact activeClassName="navlink-selected" className="nav-link" >
            {text}
        </NavLink>
    )
}

export default NavigationLink;