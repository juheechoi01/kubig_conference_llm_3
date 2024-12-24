"use client";
import { Inbox, PenBox, Settings, Sidebar } from "lucide-react";
import React, { useEffect, useState } from "react";
import ChatroomList from "./chatroom-list";
import { useRouter } from "next/navigation";
import ConfirmModal from "./modal";

import { ChatRoom } from "@prisma/client";

const SideBar = ({
    chatrooms,
    createChatroom,
    deleteChatroom,
}: {
    chatrooms: ChatRoom[];
    createChatroom: () => void;
    deleteChatroom: (id: string) => void;
}) => {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedChatroomId, setSelectedChatroomId] = useState<string | null>(
        null
    );

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev);
    };

    // 채팅방 삭제 모달 열기/닫기

    const openDeleteModal = (id: string) => {
        setSelectedChatroomId(id);
        setModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedChatroomId(null);
        setModalOpen(false);
    };

    const confirmDeleteChatroom = () => {
        if (selectedChatroomId) {
            deleteChatroom(selectedChatroomId);
            closeDeleteModal();
        }
    };

    // 외부 클릭 시 isExpanded를 false로 설정
    const handleOutsideClick = (event: MouseEvent) => {
        const sidebar = document.getElementById("sidebar");
        if (sidebar && !sidebar.contains(event.target as Node)) {
            setIsExpanded(false);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 이벤트 리스너 추가
        document.addEventListener("click", handleOutsideClick);
        return () => {
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <div
            className="h-full hidden sm:flex mt-[10] rounded-r-lg"
            id="sidebar"
        >
            <div
                className="bg-gradient-to-b from-[#c2dbf9] to-[#87bdff] space-y-4 flex flex-col text-primary rounded-r-lg w-[80px]"
                style={{
                    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.2)",
                }}
            >
                <div className="p-6 flex-col m-0 space-y-6 rounded-r-lg bg-transparent">
                    {/* sidebar */}
                    <div className="relative group ">
                        <button
                            className="cursor-pointe transition-colors"
                            onClick={toggleSidebar}
                        >
                            <Sidebar color="white" size={30} />
                        </button>
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg z-50">
                            {isExpanded ? "Open Chatlist" : "Close Chatlist"}
                        </span>
                    </div>

                    {/* add chatroom */}
                    <div className="relative group">
                        <button
                            className="cursor-pointer transition-colors "
                            onClick={createChatroom}
                        >
                            <PenBox color="white" size={30} />
                        </button>
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg z-50">
                            Add Chatroom
                        </span>
                    </div>

                    {/* archive */}
                    <div className="relative group">
                        <button
                            className="cursor-pointer"
                            onClick={() => {
                                router.push("/archive");
                                setIsExpanded(false); // Archive 버튼 클릭 시 사이드바 닫기
                            }}
                        >
                            <Inbox color="white" size={30} />
                        </button>
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg z-50">
                            Archive
                        </span>
                    </div>

                    {/* setting */}
                    <div className="group absolute bottom-6  ">
                        <button className="cursor-pointer hover:text-blue-300 transition-colors">
                            <Settings color="white" size={30} />
                        </button>
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg">
                            Settings
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <div
                    className={`bg-gradient-to-br from-[#dcecff] via-[#dcecff]  to-[#bedbff] overflow-y-auto h-full transition-all duration-500 ease-in-out z-10 ${
                        isExpanded ? "w-[300px] p-5" : "w-0 p-0"
                    } rounded-lg`}
                    style={{
                        boxShadow: `inset 0 -5px 8px rgba(255, 255, 255, 0.8),
                                    3px 0 8px rgba(0, 0, 0, 0.2)
                        `,
                    }}
                >
                    {isExpanded && (
                        <ChatroomList
                            chatrooms={chatrooms}
                            onDeleteChatroom={openDeleteModal}
                            onChatroomClick={() => setIsExpanded(false)}
                        />
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={modalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteChatroom}
                title="채팅방 삭제"
                description="정말로 이 채팅방을 삭제하시겠습니까?"
            />
        </div>
    );
};

export default SideBar;
