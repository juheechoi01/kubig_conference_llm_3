"use client";

import { ChatMessageProps } from "@/components/message";
import { ChatRoom, Message } from "@prisma/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompletion } from "ai/react";


import ChatMessages from "@/components/messages";
import ChatForm from "@/components/chat-form";

interface ChatClientProps {
    chatroom: ChatRoom & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
}

const ChatClient = ({ chatroom }: ChatClientProps) => {
    const router = useRouter();

    const [messages, setMessages] = useState<ChatMessageProps[]>(
        chatroom.messages
    );
    const { input, isLoading, handleInputChange, handleSubmit, setInput } =
        useCompletion({
            api: `/api/chat/${chatroom.id}/messages`,
            onFinish(prompt, completion) {
                const systemMessage: ChatMessageProps = {
                    role: "system",
                    content: completion,
                };

                setMessages((current) => [...current, systemMessage]);
                setInput("");

                router.refresh();
            },
        });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const userMessage: ChatMessageProps = {
            role: "user",
            content: input,
        };

        setMessages((current) => [...current, userMessage]);

        handleSubmit(e);
    };

    return (
        <div className="flex flex-col h-full p-4 flex-1">
            <ChatMessages
                chatroom={chatroom!}
                isLoading={isLoading}
                messages={messages}
            />
            <ChatForm
                isLoading={isLoading}
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default ChatClient;
