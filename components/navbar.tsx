"use client";

import React, { useMemo, useState } from "react";
import MobileSidebar from "./mobile-sidebar";
import { ChatRoom } from "@prisma/client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LoginModal from "./login-modal";

interface NavBarProps {
    chatrooms: ChatRoom[];
    createChatroom: () => void;
    deleteChatroom: (id: string) => void;
    renameChatroom: (id: string, newName: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({
    chatrooms,
    createChatroom,
    deleteChatroom,
    renameChatroom,
}) => {
    const pathname = usePathname();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // 현재 경로에서 chatroomId 추출
    const activeChatroomName = useMemo(() => {
        const match = pathname?.match(/\/chat\/([\w-]+)/); // 경로에서 '/chat/:id' 추출
        const chatroomId = match ? match[1] : null;

        // chatrooms 배열에서 현재 chatroomId에 해당하는 채팅방 이름 찾기
        const activeChatroom = chatrooms.find(
            (chatroom) => chatroom.id === chatroomId
        );
        return activeChatroom ? activeChatroom.name : "";
    }, [pathname, chatrooms]);

    return (
        <div
            className="fixed w-full flex items-center border-b bg-white px-3 pt-2 pb-4 rounded-b-[15]"
            style={{
                boxShadow: `0 1.2px 3px 0 rgba(0,0,0,0.2)`,
            }}
        >
            <div>
                <MobileSidebar
                    chatrooms={chatrooms}
                    createChatroom={createChatroom}
                    deleteChatroom={deleteChatroom}
                    renameChatroom={renameChatroom}
                />
            </div>

            <div className="flex-1 flex justify-center sm:justify-start  ">
                <button
                    className="pl-3"
                    onClick={() => window.location.replace("/")}
                >
                    <div className="flex items-center">
                        <Image
                            src="/images/nararag-logo.png"
                            alt="NaraRAG"
                            width={70}
                            height={100}
                        />
                    </div>
                </button>
                <div className="flex-1 flex justify-center text-[20px] pt-2">
                    {activeChatroomName || ""}
                </div>

                <button
                    className="absolute right-8 pt-3"
                    onClick={() => setIsLoginModalOpen(true)}
                >
                    Login
                </button>
                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={() => setIsLoginModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default NavBar;
