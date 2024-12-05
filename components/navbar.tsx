import React from "react";
import MobileSidebar from "./mobile-sidebar";

const NavBar = () => {
    return (
        <div className="fixed w-full flex items-center border-b bg-white p-5">
            <MobileSidebar />

            <button>
                <h1 className="font-bold text-2xl flex w-full justify-center md:justify-start">
                    <span style={{ color: "rgb(217, 90, 0)" }}>NaraRAG</span>
                    📜⚖️
                </h1>
            </button>
        </div>
    );
};

export default NavBar;
