import React from "react";

interface INavLinkProps {
    href: string;
    label: string;
}

const ExLink = ({href, label}: INavLinkProps) => {
    return (
        <a className="nav-link" href={href}>
            {label}
        </a>
    )
}

export default ExLink;