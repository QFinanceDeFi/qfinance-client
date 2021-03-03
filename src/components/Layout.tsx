import React from "react";
import Navigation from "./Navigation/Navigation";
import Title from "./Title/Title";
import "./layout.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Layout = ({ children }: any) => {
    return (
        <>
        <Navigation />
        <div className="main">
            <Title />
            {children}
        </div>
        </>
    )
}

export default Layout;