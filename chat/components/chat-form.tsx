"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";
import { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";

interface ChatFormProps {
    input: string;
    handleInputChange: (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
    ) => void;
    onSubmit: (
        e: FormEvent<HTMLFormElement>,
        chatRequestOptions?: ChatRequestOptions | undefined
    ) => void;

    isLoading: boolean;
}

const ChatForm = ({
    input,
    handleInputChange,
    onSubmit,
    isLoading,
}: ChatFormProps) => {
    return (
        <form
            onSubmit={onSubmit}
            className="border-t border-primary/10 py-4 flex items-center gap-x-2" 
        >
            <Input
                disabled={isLoading}
                value={input}
                onChange={handleInputChange}
                placeholder="Talk with your companion"
                className="rounded-lg bg-slate-200
                "
            />

            <Button disabled={isLoading} variant="ghost">
                <SendHorizonal className="h-6 w-6" />
            </Button>
        </form>
    );
};

export default ChatForm;
