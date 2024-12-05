"use client";

import { Inbox, PenBox, Settings, Sidebar } from "lucide-react";
import React, { useEffect, useState } from "react";
import ChatroomList from "./chatroom-list";
import { useRouter } from "next/navigation";
import ConfirmModal from "./modal";

interface ChatRoom {
    id: string;
    name: string;
}

const SideBar = () => {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedChatroomId, setSelectedChatroomId] = useState<string | null>(
        null
    );

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev);
    };

    const fetchChatrooms = async () => {
        try {
            const response = await fetch("/api/chat");
            if (!response.ok) {
                throw new Error("Failed to fetch chatrooms");
            }
            const data = await response.json();
            setChatrooms(data);
        } catch (error) {
            console.error("Failed to fetch chatrooms:", error);
        }
    };

    useEffect(() => {
        fetchChatrooms();
    }, []);

    const createChatroom = async () => {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ name: "New Chat Room" }), // 기본 이름 설정
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to create chatroom");
            }

            const newChatroom: ChatRoom = await response.json();
            setChatrooms((prev) => [...prev, newChatroom]);
            router.push(`/chat/${newChatroom.id}`);
        } catch (error) {
            console.error("Error creating chatroom:", error);
        }
    };

    const openDeleteModal = (id: string) => {
        setSelectedChatroomId(id);
        setModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedChatroomId(null);
        setModalOpen(false);
    };

    const confirmDeleteChatroom = async () => {
        if (!selectedChatroomId) return;

        try {
            const response = await fetch(
                `/api/chat/${selectedChatroomId}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete chatroom");
            }

            setChatrooms(
                (prev) =>
                    prev.filter(
                        (chatroom) => chatroom.id !== selectedChatroomId
                    ) // 상태 갱신
            );
        } catch (error) {
            console.error("Error deleting chatroom:", error);
        } finally {
            closeDeleteModal(); // 삭제 확인 모달 닫기
        }
    };

    return (
        <div className="h-full hidden md:flex">
            <div className="bg-blue-700 space-y-4 flex flex-col text-primary rounded-r-lg w-[80px]">
                <div className="p-6 flex-col m-0 space-y-6">
                    {/* sidebar */}
                    <div className="relative group">
                        <button
                            className="cursor-pointe transition-colors"
                            onClick={toggleSidebar}
                        >
                            <Sidebar color="white" size={30} />
                        </button>
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg">
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
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg">
                            Add Chatroom
                        </span>
                    </div>

                    {/* archive */}
                    <div className="relative group">
                        <button className="cursor-pointer hover:text-blue-300 transition-colors">
                            <Inbox color="white" size={30} />
                        </button>
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg">
                            Archive
                        </span>
                    </div>

                    {/* setting */}
                    <div className="relative group">
                        <button className="cursor-pointer hover:text-blue-300 transition-colors">
                            <Settings color="white" size={30} />
                        </button>
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg">
                            Settings
                        </span>
                    </div>
                </div>
            </div>
            <div
                className={`bg-sky-100 overflow-y-auto h-full transition-all duration-500 ease-in-out ${
                    isExpanded ? "w-[300px] p-8" : "w-0 p-0"
                } rounded-r-lg`}
            >
                {isExpanded && (
                    <ChatroomList
                        chatrooms={chatrooms}
                        onDeleteChatroom={openDeleteModal}
                    />
                )}
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
