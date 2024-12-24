import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

// POST 요청: 메시지를 아카이브
export async function POST(req: NextRequest) {
    try {
        const { content, chatroomId, chatroomName } = await req.json();

        if (!content || !chatroomId || !chatroomName) {
            return NextResponse.json(
                { error: "Content, chatroomId, and chatroomName are required" },
                { status: 400 }
            );
        }

        const archivedMessage = await prismadb.archivedMessage.create({
            data: {
                content,
                chatroomId,
                chatroomName,
            },
        });

        return NextResponse.json(archivedMessage, { status: 201 });
    } catch (error) {
        console.error("Error archiving message:", error);
        return NextResponse.json(
            { error: "Failed to archive message" },
            { status: 500 }
        );
    }
}

// GET 요청: 아카이브된 메시지 목록 가져오기
export async function GET() {
    try {
        const archivedMessages = await prismadb.archivedMessage.findMany({
            orderBy: { createdAt: "desc" }, // 최신 메시지 우선 정렬
        });

        return NextResponse.json(archivedMessages);
    } catch (error) {
        console.error("Error fetching archived messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch archived messages" },
            { status: 500 }
        );
    }
}
