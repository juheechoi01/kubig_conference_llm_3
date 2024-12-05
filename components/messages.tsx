"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import ChatMessage, { ChatMessageProps } from "./message";
import { ChatRoom } from "@prisma/client";

interface ChatMessagesProps {
    messages: ChatMessageProps[];
    isLoading: boolean;
    chatroom: ChatRoom;
}

const ChatMessages = ({ messages = [], isLoading }: ChatMessagesProps) => {
    const scrollRef = useRef<ElementRef<"div">>(null);

    const [fakeLoading, setFakeLoading] = useState(messages.length === 0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false);
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const [allMessages, setAllMessages] = useState<ChatMessageProps[]>([
        {
            role: "system",
            content: `안녕하세요! 국회 회의록에 관해 궁금한 것이 있으면 언제든 물어봐주세요 😊`,
        },
        ...messages, // 기존 메시지 추가
    ]);

    return (
        <div className="flex-1 overflow-auto pr-4">
            {allMessages.map((message, index) => (
                <ChatMessage
                    key={`${message.content}-${index}`}
                    role={message.role}
                    content={message.content}
                    isLoading={index === 0 ? fakeLoading : undefined} // 첫 메시지만 로딩 효과
                />
            ))}

            {isLoading && <ChatMessage role="system" isLoading />}

            <div ref={scrollRef} />
        </div>
    );
};

export default ChatMessages;
