"use client";

import { cn } from "../lib/utils";
import { BeatLoader } from "react-spinners";

import { useTheme } from "next-themes";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

import BotAvatar from "./bot-avatar";
import UserAvatar from "./user-avatar";
import { useEffect, useState } from "react";

export interface ChatMessageProps {
    role: "system" | "user";
    content?: string;
    isLoading?: boolean;
    src?: string;
}

const ChatMessage = ({ role, content = "", isLoading, src }: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();
    const [animatedContent, setAnimatedContent] = useState(""); // 실시간 표시 메시지
    const [typingIndex, setTypingIndex] = useState(0); // 현재 타이핑 중인 위치

    useEffect(() => {
        if (role !== "system" || isLoading) {
            // 유저 메시지에는 타이핑 효과를 적용하지 않음, 로딩 중일 경우 초기화
            setAnimatedContent("");
            setTypingIndex(0);
            return;
        }

        if (content && typingIndex < content.length) {
            const timer = setTimeout(() => {
                setAnimatedContent((prev) => prev + content[typingIndex]);
                setTypingIndex((prev) => prev + 1);
            }, 30); // 타이핑 속도 조정 (30ms 간격)

            return () => clearTimeout(timer); // 타이머 정리
        } else {
            setAnimatedContent(content || "")
        }
    }, [role, content, typingIndex, isLoading]);

    const onCopy = () => {
        if (!content) {
            return;
        }

        navigator.clipboard.writeText(content);
        toast({
            description: "Messages copied to clipboard",
        });
    };

    const formatContent = (text: string) => {
        return text.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    return (
        <div
            className={cn(
                "group flex items-start gap-x-3 py-6 w-full",
                role === "user" && "justify-end"
            )}
        >
            {role !== "user" && <BotAvatar />}
            <div className="mt-[3] rounded-b-md px-4 py-3 max-w-sm text-sm bg-primary/10">
                {isLoading ? (
                    <BeatLoader
                        size={5}
                        color={theme === "light" ? "black" : "white"}
                    />
                ) : (
                    role === "system" ? formatContent(animatedContent) : content
                )}
            </div>

            {role === "user" && <UserAvatar />}
            {role !== "user" && !isLoading && (
                <Button
                    onClick={onCopy}
                    className="opacity-0 group-hover:opacity-100 transition"
                    size="icon"
                    variant="ghost"
                >
                    <Copy />
                </Button>
            )}
        </div>
    );
};

export default ChatMessage;
