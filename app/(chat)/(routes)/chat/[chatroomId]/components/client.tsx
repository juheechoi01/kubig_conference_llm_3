"use client";

import { ChatMessageProps } from "@/components/message";
import { ChatRoom, Message } from "@prisma/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ChatMessages from "@/components/messages";
import ChatForm from "@/components/chat-form";

interface ChatClientProps {
    chatroom?: ChatRoom & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
}

const ChatClient = ({ chatroom }: ChatClientProps) => {
    const router = useRouter();

    const initialMessages =
        chatroom?.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        })) || [];

    const [messages, setMessages] =
        useState<ChatMessageProps[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);


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
                handleInputChange={(e) => setInput(e.target.value)}
                // onSubmit={sendMessage}
            />
        </div>
    );
};

export default ChatClient;
