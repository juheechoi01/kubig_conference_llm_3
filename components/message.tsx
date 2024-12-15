"use client";

import { cn } from "../lib/utils";
import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { MoreVertical, Copy, Inbox } from "lucide-react";

import BotAvatar from "./bot-avatar";
import UserAvatar from "./user-avatar";
import { useEffect, useState, useRef } from "react";

export interface ChatMessageProps {
    role: "system" | "user";
    content?: string;
    isLoading?: boolean;
    src?: string;
}

const ChatMessage = ({ role, content = "", isLoading }: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();
    const [animatedContent, setAnimatedContent] = useState("");

    const [typingIndex, setTypingIndex] = useState(0); // 현재 타이핑 중인 위치

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        if (dropdownVisible) {
            setDropdownOpen(false);
            setTimeout(() => setDropdownVisible(false), 300);
        } else {
            setDropdownVisible(true);
            setTimeout(() => setDropdownOpen(true), 0); // 바로 열기 시작
        }
    };
    const closeDropdown = () => {
        setDropdownOpen(false);
        setTimeout(() => setDropdownVisible(false), 300);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                closeDropdown();
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        if (role !== "system") {
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
            setAnimatedContent(content || "");
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
                ) : role === "system" ? (
                    formatContent(animatedContent)
                ) : (
                    content
                )}
            </div>

            {role === "user" && <UserAvatar />}

            {role !== "user" && !isLoading && (
                <div className="relative" ref={dropdownRef}>
                    {/* MoreVertical Button */}
                    <Button
                        onClick={(e) => {
                            e.stopPropagation(); // 클릭 이벤트 전파 방지
                            toggleDropdown();
                        }}
                        className="opacity-0 group-hover:opacity-100 transition"
                        size="icon"
                        variant="ghost"
                    >
                        <MoreVertical />
                    </Button>

                    {/* Dropdown Menu */}
                    {dropdownVisible && (
                        <div
                            id="dropdown"
                            className={cn(
                                "absolute left-5 mt-2 w-40 bg-white border rounded shadow-lg z-10",
                                "transition-all duration-300 ease-in-out",
                                dropdownOpen
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95"
                            )}
                            onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
                        >
                            <button
                                onClick={() => {
                                    onCopy();
                                    closeDropdown(); // 드롭다운 닫기
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Copy size={15} className="mr-2" />
                                <span className="text-[13px] ">
                                    Copy Message
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    toast({
                                        description: "Message archived!",
                                    });
                                    closeDropdown();
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Inbox size={15} className="mr-2" />
                                <span className="text-[13px] ">Archive</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
