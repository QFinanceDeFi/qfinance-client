import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

interface INavLinkProps {
    to: string;
    label: string;
}

const NavLink = ({to, label}: INavLinkProps) => {
    return (
        <RouterNavLink className="nav-link" to={to}>
            {label}
        </RouterNavLink>
    )
}

export default NavLink;