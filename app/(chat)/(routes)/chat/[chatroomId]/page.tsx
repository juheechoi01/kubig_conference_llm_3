import React from "react";
import ChatClient from "@/app/(chat)/(routes)/chat/[chatroomId]/components/client";
import prismadb from "@/lib/prismadb";

interface ChatPageProps {
    params: {
        chatroomId?: string;
    };
}

const ChatRoomPage = async ({ params }: ChatPageProps) => {
    const { chatroomId } = await params;


    // 데이터베이스에서 채팅방 조회 및 메시지 불러오기
    const chatroom = await prismadb.chatRoom.findUnique({
        where: { id: chatroomId },
        include: {
            messages: {
                orderBy: { createdAt: "asc" }, // 메시지 정렬 (오래된 순서)
            },
        },
    });

    return <ChatClient chatroom={chatroom} />;
};

export default ChatRoomPage;
