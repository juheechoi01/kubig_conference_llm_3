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
    onChatroomClick: () => void;
}

const ChatroomList: React.FC<ChatroomListProps> = ({
    chatrooms,
    onDeleteChatroom,
    onChatroomClick,
}) => {
    const router = useRouter();
    const pathname = usePathname(); // 현재 경로 가져오기

    return (
        <div className="space-y-2 overflow-y-auto max-h-[400px]">
            {chatrooms.length === 0 ? (
                <p className="white align-middle">No chatrooms available</p>
            ) : (
                chatrooms.map((chatroom) => {
                    const isActive = pathname === `/chat/${chatroom.id}`; // 현재 경로와 비교
                    return (
                        <div
                            key={chatroom.id}
                            className={`flex justify-between items-center cursor-pointer p-2 px-3 rounded ${
                                isActive
                                    ? "bg-[#b2d5ff] font-bold"
                                    : "hover:bg-[#c6dfff]"
                            }`}
                            onClick={() => {
                                if (!isActive) {
                                    router.push(`/chat/${chatroom.id}`);
                                }
                                onChatroomClick();
                            }}
                        >
                            <span>{chatroom.name}</span>
                            {/* Trash Icon */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // 클릭 이벤트 전파 방지
                                    if (onDeleteChatroom) {
                                        onDeleteChatroom(chatroom.id);
                                    }
                                }}
                                className="text-gray-400 hover:text-red-500 ml-2 py-2"
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
