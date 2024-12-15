import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(
    req: NextRequest,
    { params }: { params: { chatroomId: string } }
) {
    try {
        const { chatroomId } = await params;
        const { input, chat_history } = await req.json();

        console.log("Received data:", { input, chat_history });

        if (!chatroomId) {
            return NextResponse.json(
                { error: "Chatroom ID is required" },
                { status: 400 }
            );
        }

        const messages = [
            ...(chat_history || []),
            { role: "user", content: input },
        ];

        const requestData = {
            input: input,
            chat_history: messages,
        };

        // Flask API 호출 (AI 모델의 응답 받기)
        const aiResponse = await fetch(
            `http://127.0.0.1:8000/api/chat/${chatroomId}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData), // 요청 본문 전달
            }
        );

        const data = await aiResponse.json();

        if (!aiResponse.ok) {
            console.error("Flask server error:", await aiResponse.text());
            return NextResponse.json(
                { error: "Failed to get response from Flask" },
                { status: 500 }
            );
        }

        if (!data || typeof data.answer !== "string") {
            return NextResponse.json(
                { error: "No answer from AI" },
                { status: 500 }
            );
        }

        // 성공적으로 응답 생성
        console.log("AI Response:", data);

        await prismadb.message.create({
            data: {
                role: "user",
                content: input,
                chatroomId: chatroomId,
            },
        });

        await prismadb.message.create({
            data: {
                role: "system",
                content: data.answer,
                chatroomId: chatroomId,
            },
        });

        return NextResponse.json({
            answer: data.answer,
            context: data.context || "",
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { chatroomId: string } }
) {
    try {
        const { chatroomId } = await params;

        // 채팅방의 모든 메시지 불러오기
        const messages = await prismadb.message.findMany({
            where: { chatroomId: chatroomId },
            orderBy: { createdAt: "asc" }, // 메시지를 시간 순으로 정렬
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
