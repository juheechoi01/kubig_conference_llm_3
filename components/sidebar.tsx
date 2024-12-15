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
            const response = await fetch(`/api/chat/${selectedChatroomId}`, {
                method: "DELETE",
            });
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
            className="h-full hidden md:flex mt-[10] rounded-r-lg"
            id="sidebar"
        >
            <div
                className="bg-gradient-to-b from-[#c2dbf9] to-[#87bdff] space-y-4 flex flex-col text-primary rounded-r-lg w-[80px]"
                style={{
                    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.2)", // 오른쪽으로 그림자
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
                        <button
                            className="cursor-pointer"
                            onClick={() => router.push("/archive")}
                        >
                            <Inbox color="white" size={30} />
                        </button>
                        <span className="absolute left-[40px] top-[15px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg">
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
                    className={`bg-gradient-to-br from-[#dcecff] via-[#dcecff]  to-[#bedbff] overflow-y-auto h-full transition-all duration-500 ease-in-out ${
                        isExpanded ? "w-[300px] p-6" : "w-0 p-0"
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
