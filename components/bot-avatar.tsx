import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const BotAvatar = () => {
    return (
        <Avatar className="h-15 w-15 -z-20">
            <AvatarFallback className="h-10 w-10 ">
                <Bot color="blue" />
            </AvatarFallback>
        </Avatar>
    );
};

export default BotAvatar;
