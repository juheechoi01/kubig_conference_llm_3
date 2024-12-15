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

    // Fake loading 상태
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0);

    // 이전 메시지와 새 메시지 인덱스 추적
    const [prevMessages, setPrevMessages] = useState<ChatMessageProps[]>([]);
    const [newMessageIndex, setNewMessageIndex] = useState<number | null>(null);

    // Fake loading 초기화
    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false);
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    // 새 메시지 식별
    useEffect(() => {
        if (messages.length > prevMessages.length) {
            const newIndex = prevMessages.length; // 새 메시지의 시작 인덱스
            setNewMessageIndex(newIndex);
        } else {
            setNewMessageIndex(null);
        }

        setPrevMessages(messages); // 현재 메시지 상태 저장
    }, [messages]);

    // 스크롤 자동 이동
    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const initialMessage: ChatMessageProps = {
        role: "system",
        content: `안녕하세요! 국회 회의록에 관해 궁금한 것이 있으면 언제든 물어봐주세요 😊`,
    };

    const allMessages = [initialMessage, ...messages];

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
