import React from "react";
import ChatClient from "./chat/[chatroomId]/components/client";

const RootPage = async () => {
    return (
        // 처음 접속하면 보이는 화면. 채팅방 아님. 
        <div className="flex h-full w-full">
            <ChatClient />
        </div>
    );
};

export default RootPage;
