import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RequestFinishModal from "../../components/chatbot/RequestFinishModal";
import OrderCancelModal from "../../components/chatbot/OrderCancelModal";
import send from "../../assets/icon/send.svg";
import orderhs from "../../assets/icon/orderhistory.svg";
import {
  ChatContainer,
  ChatTitle,
  ChatBox,
  Message,
  ChatInput,
  InputContainer,
  InputField,
  BtnWrap,
  SendButton,
  SendIcon,
  HsIcon,
} from "../../styles/chatbot/chatBot.module";
import { BtnContainer } from "../../styles/components/chatbotModal.module";

const host =
  window.location.hostname === "localhost" ? "http://3.34.149.35:5000" : "api";

export const apiClient = axios.create({
  baseURL: host,
});

export default function ChatBot() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "호우섬에 오신 것을 환영합니다!" },
  ]);
  const chatBoxRef = useRef(null);

  const chatBotMsg = async (question) => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/api/chat`, {
        question: question,
      });
      return response.data.response;
    } catch (error) {
      console.error("챗봇 API 호출 오류:", error);
      return "죄송합니다, 답변을 가져올 수 없습니다.";
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = input.trim();

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userMessage },
      ]);

      setInput("");

      const botReply = await chatBotMsg(userMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botReply },
      ]);
    }
  };

  const handleCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "40px"; // 기본 높이
    e.target.style.height = `${Math.min(e.target.scrollHeight, 84)}px`; // 최대 3줄까지만 확장
  };

  // 자동으로 최신 메시지로 스크롤
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // 메시지가 변경될 때마다 스크롤을 맨 아래로

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "주문 또는 궁금한 점을 입력하세요. 대화를 종료하려면 '종료' 또는 '그만'을 입력하세요.",
        },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ChatContainer>
        <ChatTitle onClick={handleCancelModal}>키키 chat</ChatTitle>
        <ChatBox ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender}>
              <p>{msg.text}</p>
            </Message>
          ))}
          {loading && (
            <Message sender="bot">
              <p>. . .</p>
            </Message>
          )}
        </ChatBox>
        <ChatInput>
          <HsIcon src={orderhs} onClick={() => navigate("/ordersummary")} />
          <InputContainer>
            <InputField
              value={input}
              onChange={handleChange}
              placeholder="메시지를 입력해주세요"
              disabled={loading}
            />
            <BtnWrap>
              <SendButton onClick={handleSendMessage} />
              <SendIcon src={send} onClick={handleSendMessage} />
            </BtnWrap>
          </InputContainer>
        </ChatInput>
      </ChatContainer>
      <RequestFinishModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <OrderCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </>
  );
}
