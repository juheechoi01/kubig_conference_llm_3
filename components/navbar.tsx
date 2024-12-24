"use client";

import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { ChatRoom } from "@prisma/client";

interface NavBarProps {
    chatrooms: ChatRoom[];
    createChatroom: () => void;
    deleteChatroom: (id: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({
    chatrooms,
    createChatroom,
    deleteChatroom,
}) => {
    return (
        <div
            className="fixed w-full flex items-center border-b bg-white px-3 py-5 rounded-b-[15]"
            style={{
                boxShadow: `0 1.2px 3px 0 rgba(0,0,0,0.2)`,
            }}
        >
            <div>
                <MobileSidebar
                    chatrooms={chatrooms}
                    createChatroom={createChatroom}
                    deleteChatroom={deleteChatroom}
                />
            </div>

            <div className="flex-1 flex justify-center sm:justify-start  ">
                {/* 버튼 클릭 시 메인 페이지로 되돌아감 */}
                <button
                    className="pl-1"
                    onClick={() => window.location.replace("/")}
                >
                    <div className="flex items-center">
                        <h1 className="font-bold text-2xl flex sm:align-middle pr-5">
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
                    </div>
                </button>
            </div>

            <div className="absolute right-8">login</div>
        </div>
    );
};

export default NavBar;
