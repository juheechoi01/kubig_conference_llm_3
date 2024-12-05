import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { TrashIcon } from "lucide-react";

interface ChatRoom {
    id: string;
    name: string;
}

interface ChatroomListProps {
    chatrooms: ChatRoom[];
    onDeleteChatroom?: (id: string) => void;
}

const ChatroomList: React.FC<ChatroomListProps> = ({
    chatrooms,
    onDeleteChatroom,
}) => {
    const router = useRouter();
    const pathname = usePathname(); // 현재 경로 가져오기

    return (
        <div className="space-y-2 overflow-y-auto max-h-[400px]">
            {chatrooms.length === 0 ? (
                <p className="text-gray-500">No chatrooms available</p>
            ) : (
                chatrooms.map((chatroom) => {
                    const isActive = pathname === `/chat/${chatroom.id}`; // 현재 경로와 비교
                    return (
                        <div
                            key={chatroom.id}
                            className={`flex justify-between items-center cursor-pointer p-2 px-3 rounded ${
                                isActive
                                    ? "bg-blue-200 font-bold"
                                    : "hover:bg-blue-100"
                            }`}
                            onClick={() => {
                                if (!isActive) {
                                    router.push(`/chat/${chatroom.id}`);
                                }
                            }}
                        >
                            <span>{chatroom.name}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // 클릭 이벤트 전파 방지 (채팅방으로 이동 방지)
                                    if (onDeleteChatroom) {
                                        onDeleteChatroom(chatroom.id);
                                    }
                                }}
                                className="text-red-500 hover:text-red-400 ml-2"
                            >
                                <TrashIcon size={20} />
                            </button>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ChatroomList;
