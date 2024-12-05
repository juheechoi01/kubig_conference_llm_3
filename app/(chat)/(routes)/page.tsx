import React from "react";
import ChatClient from "./chat/[chatroomId]/components/client";

const RootPage = async () => {
    return (
        <div className="flex h-full w-full">
            <ChatClient />
        </div>
    );
};

export default RootPage;
