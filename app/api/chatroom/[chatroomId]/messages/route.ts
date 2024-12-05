import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import prismadb from "@/lib/prismadb";

// AI 모델 초기화
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    maxTokens: 2048,
    apiKey: process.env.OPENAI_API_KEY,
});

// 특정 채팅방에서 메시지 전송 및 AI 응답 처리
export async function POST(
    req: NextRequest,
    { params }: { params: { chatRoomId: string } }
) {
    console.log("Posting in API...");
    const { chatRoomId } = await params;

    if (!chatRoomId) {
        return NextResponse.json(
            { error: "ChatRoom ID is required" },
            { status: 400 }
        );
    }

    try {
        const body = await req.json();
        const userMessage = body?.message;

        if (!userMessage) {
            console.error("User message is missing in the request body.");
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // 채팅방 ID 유효성 확인
        const chatRoom = await prismadb.chatRoom.findUnique({
            where: { id: chatRoomId },
        });

        if (!chatRoom) {
            return NextResponse.json(
                { error: "Invalid chatRoomId" },
                { status: 404 }
            );
        }

        // AI 모델 호출
        let aiReply = "I'm sorry, I couldn't process that.";
        try {
            const aiResponse = await model.invoke([
                { role: "user", content: userMessage },
            ]);
            aiReply = aiResponse?.text || aiReply;
        } catch (error) {
            console.error("AI model error:", error);
        }

        // 메시지 저장
        const [savedUserMessage, savedAIMessage] = await prismadb.$transaction([
            prismadb.message.create({
                data: {
                    role: "user",
                    content: userMessage,
                    chatRoomId, 
                },
            }),
            prismadb.message.create({
                data: {
                    role: "system",
                    content: aiReply,
                    chatRoomId, 
                },
            }),
        ]);

        return NextResponse.json({
            messages: {
                success: true,
                userMessage: savedUserMessage,
                aiReply: savedAIMessage,
            },
        });
    } catch (error) {
        console.error("Error processing chat request:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
