import { TrashIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ConfirmModal from "./modal";
import { cn } from "@/lib/utils";

interface ArchiveMessageProps {
    content: string;
    chatroomName: string;
    createdAt: string;
    messageId: string;
    onDelete: (messageId: string) => void;
}

const formatContent = (text: string) => {
    return text.split("\n").map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
};

const ArchiveMessage = ({
    content,
    chatroomName,
    createdAt,
    messageId,
    onDelete,
}: ArchiveMessageProps) => {
    const [height, setHeight] = useState("300px");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            if (contentHeight > 300 && contentHeight <= 400) {
                setHeight("400px");
            } else if (contentHeight > 400) {
                setHeight("400px");
                contentRef.current.style.overflowY = "scroll";
            } else {
                setHeight("350");
            }
        }
    }, [content]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/archive/${messageId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete message");
            }

            onDelete(messageId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <div
            className={cn(
                "w-full rounded-md px-7 py-4 text-sm bg-primary/10 flex flex-col justify-between", "animate-archive-up"
            )}
            style={{ height }}
        >
            <div ref={contentRef} className="overflow-hidden">
                <p>{formatContent(content)}</p>
            </div>
            <div className="pt-2 text-left text-xs text-gray-500">
                <p className="font-semibold mb-2">{chatroomName}</p>

                <div className="flex justify-between">
                    {new Date(createdAt).toLocaleString()}
                    <button
                        className="text-gray-500 hover:text-gray-400"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <TrashIcon size={17} />
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <ConfirmModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleDelete}
                    title="채팅방 삭제"
                    description="정말로 이 채팅방을 삭제하시겠습니까?"
                />
            )}
        </div>
    );
};

export default ArchiveMessage;
