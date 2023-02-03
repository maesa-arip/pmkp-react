import React from "react";
import Logo from "../../img/rsbm.png";

export default function ApplicationLogo({ className }) {
    return (
        <img className="w-8 h-8" alt="logo" aria-label="applogo" src={Logo} />
    );
}
