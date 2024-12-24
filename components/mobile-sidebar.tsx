"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Inbox, Menu, PenBox } from "lucide-react";
import { useRouter } from "next/navigation";

import ConfirmModal from "./modal";

import { ChatRoom } from "@prisma/client";
import MobileChatroomList from "./mobile-chatroom-list";

const MobileSidebar = ({
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

    return (
        <Sheet open={isExpanded} onOpenChange={setIsExpanded}>
            <SheetTrigger className="sm:hidden">
                <Menu size={28} />
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[300] bg-gradient-to-br from-[#dcecff] via-[#dcecff]  to-[#bedbff] z-[8000] pointer-events-auto"
            >
                <SheetTitle className="sr-only">Chatroom List</SheetTitle>
                <div>
                    <div className="relative flex gap-5">
                        <div className="group">
                            <button
                                className="cursor-pointer transition-colors"
                                onClick={() => {
                                    createChatroom();
                                    setIsExpanded(false);
                                }}
                            >
                                <PenBox className="gray" size={30} />
                            </button>
                            <span className="absolute top-[55px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg z-50">
                                Add Chatroom
                            </span>
                        </div>
                        <div className="group">
                            <button
                                className="cursor-pointer transition-colors"
                                onClick={() => {
                                    router.push("/archive");
                                    setIsExpanded(false);
                                }}
                            >
                                <Inbox color="black" size={30} />
                            </button>
                            <span className="absolute top-[55px] transform -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded-lg shadow-lg z-50">
                                Archive
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col h-full pt-10">
                    <MobileChatroomList
                        chatrooms={chatrooms}
                        onDeleteChatroom={openDeleteModal}
                        onChatroomClick={() => setIsExpanded(false)}
                    />
                </div>
            </SheetContent>

            <ConfirmModal
                isOpen={modalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteChatroom}
                title="채팅방 삭제"
                description="정말로 이 채팅방을 삭제하시겠습니까?"
            />
        </Sheet>
    );
};

export default MobileSidebar;
