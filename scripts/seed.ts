const { createClient } = require("@supabase/supabase-js");

const { PrismaClient } = require("@prisma/client");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL과 Key가 설정되지 않았습니다.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const prisma = new PrismaClient();

async function main() {
    // 디폴트 채팅방 생성
    const defaultChatRoom = await prisma.chatRoom.upsert({
        where: { id: "default" }, // 디폴트 채팅방 고유 ID
        update: {},
        create: {
            id: "default", // 고정된 ID
            src: "https://example.com/default-avatar.png", // 디폴트 아바타 URL
            name: "Default Chatroom",
            instructions: "This is the default chatroom. Feel free to chat!",
            messages: {
                create: [
                    {
                        role: "system",
                        content: "Welcome to the default chatroom!",
                    },
                ],
            },
        },
    });

    console.log("Default chatroom created:", defaultChatRoom);
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
