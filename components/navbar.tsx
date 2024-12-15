import React from "react";
import MobileSidebar from "./mobile-sidebar";

const NavBar = () => {
    return (
        <div
            className="fixed w-full flex items-center border-b bg-white p-5 rounded-b-[15]"
            style={{
                boxShadow: `0 1.2px 3px 0 rgba(0,0,0,0.2)`,
            }}
        >
            <MobileSidebar />

            <button>
                <h1 className="font-bold text-2xl flex w-full justify-center md:align-middle">
                    <span
                        style={{
                            color: "white",
                            WebkitTextStroke: "0.8px rgb(217, 90, 0)",
                        }}
                    >
                        Nara
                    </span>
                    <span
                        style={{
                            color: "skyblue",
                        }}
                    >
                        RAG
                    </span>
                </h1>
            </button>

            <div className="absolute right-8">login</div>
        </div>
    );
};

export default NavBar;
