import os
import uuid
from dotenv import load_dotenv
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_upstage import UpstageEmbeddings, ChatUpstage
from langchain_chroma import Chroma
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# 환경 변수 로드
load_dotenv()

# FastAPI 초기화
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트엔드 도메인
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)


# 데이터 클래스 정의
class ChatRequest(BaseModel):
    input: str
    chat_history: List[Dict[str, str]]  # {"role": "user" | "assistant", "content": str}


class ChatResponse(BaseModel):
    answer: str
    context: str


# RAG 구성
vectorstore = Chroma(
    collection_name="split_parents",
    embedding_function=UpstageEmbeddings(model="embedding-passage"),
    persist_directory="child_DB(Chroma, Upstage, Custom2)",  # ChromaDB 경로
)

chat = ChatUpstage()

# MultiQueryRetriever 구성
retriever = MultiQueryRetriever.from_llm(retriever=vectorstore.as_retriever(), llm=chat)

# 질문 재구성 프롬프트
contextualize_q_system_prompt = "When there are older conversations and more recent user questions, these questions may be related to previous conversations. In this case, change the question to a question that can be understood independently without needing to know the content of the conversation. You don't have to answer the question, just reformulate it if necessary or leave it as is."

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

# 문맥 기반 Retriever 생성
history_aware_retriever = create_history_aware_retriever(
    chat, retriever, contextualize_q_prompt
)

# 질문-답변 프롬프트
qa_system_prompt = """
You are an intelligent assistant helping the members of the Korean National Assembly with questions related to law and policy. Read the given questions carefully and WRITE YOUR ANSWER ONLY BASED ON THE CONTEXT AND DON'T SEARCH ON THE INTERNET. Give the answer in Korean ONLY using the following pieces of the context. You must answer politely.

DO NOT TRY TO MAKE UP AN ANSWER:
 - If the answer to the question cannot be determined from the context alone, say "I cannot determine the answer to that.".
 - If the context is empty, just say "I do not know the answer to that.".

Context: {context} """


qa_prompt = ChatPromptTemplate.from_messages(
    [
        ('system', qa_system_prompt),
        MessagesPlaceholder('chat_history'),
        ('human','{input}'+' 답변은 구체적으로 최신 정보부터 시간의 흐름에 따라 작성해줘. 그리고 답변할 때 metadata에 있는 source 링크를 함께 제공해줘.'),
    ]
)

# 최종 체인 생성
question_answer_chain = create_stuff_documents_chain(chat, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)


# API 엔드포인트
@app.post("/api/chat/{chatroom_id}/messages", response_model=ChatResponse)
async def chat_endpoint(chatroom_id: str, request: ChatRequest):
    try:
        print(f"Received message for chatroom {chatroom_id}: {request.dict()}")

        # chat_history가 올바른지 확인
        if not isinstance(request.chat_history, list):
            raise HTTPException(status_code=400, detail="chat_history must be a list")

        # RAG 체인 실행
        result = rag_chain.invoke(
            {
                "input": request.input,
                "chat_history": request.chat_history,
            }
        )

        context = result.get("context", "")

        # context가 Document 객체를 포함할 경우 처리
        if isinstance(context, list):
            # context가 리스트인 경우 각 요소를 문자열로 변환
            context = "\n".join(
                [str(doc) if not isinstance(doc, str) else doc for doc in context]
            )
        elif not isinstance(context, str):
            # context가 단일 객체인 경우 문자열로 변환
            context = str(context)

        # 응답 요약

        print("RAG result:", result)  # RAG 결과 출력

        return ChatResponse(
            answer=result["answer"],
            context=context,
        )
    except Exception as e:
        print(f"Error in /api/chat/{chatroom_id}/messages:", e)  # 예외 메시지 출력
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
