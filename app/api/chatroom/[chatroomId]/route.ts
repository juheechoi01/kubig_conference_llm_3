import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// 특정 채팅방 조회
export async function GET(
    req: NextRequest,
    { params }: { params: { chatroomId: string } }
) {
    try {
        const { chatroomId } = await params;

        if (!chatroomId) {
            return NextResponse.json(
                { error: "Chatroom ID is required" },
                { status: 400 }
            );
        }

        const chatroom = await prismadb.chatRoom.findUnique({
            where: { id: chatroomId },
            include: {
                messages: { orderBy: { createdAt: "asc" } }, // 채팅 메시지 포함
            },
        });

        if (!chatroom) {
            return NextResponse.json(
                { error: "Chatroom not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(chatroom);
    } catch (error) {
        console.error("Error fetching chatroom:", error);
        return NextResponse.json(
            { error: "Failed to fetch chatroom" },
            { status: 500 }
        );
    }
}

// 특정 채팅방 삭제
export async function DELETE(
    req: NextRequest,
    { params }: { params: { chatroomId: string } }
) {
    try {
        const { chatroomId } = await params;

        if (!chatroomId) {
            return NextResponse.json(
                { error: "Chatroom ID is required" },
                { status: 400 }
            );
        }

        await prismadb.chatRoom.delete({
            where: { id: chatroomId },
        });

        return NextResponse.json({ message: "Chatroom deleted successfully" });
    } catch (error) {
        console.error("Error deleting chatroom:", error);
        return NextResponse.json(
            { error: "Failed to delete chatroom" },
            { status: 500 }
        );
    }
}