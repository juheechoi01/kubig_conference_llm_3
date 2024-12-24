"use client";

import React, { useEffect, useState } from "react";
import NavBar from "./navbar";
import SideBar from "./sidebar";

import { ChatRoom } from "@prisma/client";
import { useRouter } from "next/navigation";

const Bars = () => {
    const router = useRouter();
    const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);

    // 채팅방 불러오기
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

    // 채팅방 생성

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

            // 새로운 채팅방으로 이동
            router.push(`/chat/${newChatroom.id}`);
        } catch (error) {
            console.error("Error creating chatroom:", error);
        }
    };

    // 채팅방 삭제
    const deleteChatroom = async (id: string) => {
        try {
            const response = await fetch(`/api/chat/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete chatroom");
            }

            setChatrooms((prev) =>
                prev.filter((chatroom) => chatroom.id !== id)
            );
        } catch (error) {
            console.error("Error deleting chatroom:", error);
        }
    };

    // 초기 데이터 로드
    useEffect(() => {
        fetchChatrooms();
    }, []);

    return (
        <div>
            <div className="fixed">
                <NavBar
                    chatrooms={chatrooms}
                    createChatroom={createChatroom}
                    deleteChatroom={deleteChatroom}
                />
            </div>

            <div className="md:flex mt-[72px] flex-col fixed inset-y-0">
                <SideBar
                    chatrooms={chatrooms}
                    createChatroom={createChatroom}
                    deleteChatroom={deleteChatroom}
                />
            </div>
        </div>
    );
};

export default Bars;
