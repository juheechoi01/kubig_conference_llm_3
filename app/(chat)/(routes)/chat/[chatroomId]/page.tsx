import React from "react";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

import ChatClient from "@/app/(chat)/(routes)/chat/[chatroomId]/components/client";

interface ChatPageProps {
    params: {
        chatroomId: string;
    };
}

const ChatRoomPage = async ({ params }: ChatPageProps) => {
    try {
        const { chatroomId } = await params;

        if (!chatroomId) {
            redirect("/");
        }

        // 데이터베이스에서 채팅방 조회 및 메시지 불러오기
        const chatroom = await prismadb.chatRoom.findUnique({
            where: { id: chatroomId },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" }, // 메시지 정렬 (오래된 순서)
                },
            },
        });

        if (!chatroom) {
            redirect("/")
        }

        return <ChatClient chatroom={chatroom} />;
    } catch (error) {
        console.error("Failed to fetch chatroom:", error);
        redirect("/");
    }
};

export default ChatRoomPage;
