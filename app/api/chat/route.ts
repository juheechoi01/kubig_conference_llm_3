import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// 채팅방 목록 조회
export async function GET() {
    try {
        console.log('chat get!')
        const chatRooms = await prismadb.chatRoom.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(chatRooms);
    } catch (error) {
        console.error("Error fetching chatrooms:", error);
        return NextResponse.json(
            { error: "Failed to fetch chatrooms" },
            { status: 500 }
        );
    }
}

// 새로운 채팅방 생성
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const name = body?.name || "New Chat Room";

        const chatRoom = await prismadb.chatRoom.create({
            data: { name },
        });

        return NextResponse.json(chatRoom);
    } catch (error) {
        console.error("Error creating chatroom:", error);
        return NextResponse.json(
            { error: "Failed to create chatroom" },
            { status: 500 }
        );
    }
}
