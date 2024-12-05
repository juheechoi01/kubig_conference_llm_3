import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const UserAvatar = () => {
    return (
        <Avatar className="h-15 w-15 -z-20">
            <AvatarFallback className="h-10 w-10 ">
                <User />
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
