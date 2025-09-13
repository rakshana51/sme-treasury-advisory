import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I’m your Robo-Advisor. What are your financial goals?" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    try {
      const res = await axios.post("http://localhost:5000/api/advice", {
        message: input,
      });
      setMessages(prev => [...newMessages, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...newMessages, { sender: "bot", text: "⚠️ Error fetching advice" }]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">
          <div>💬 Robo-Advisor</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Powered by Groq</div>
        </div>

        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.sender === "user" ? "user" : "bot"}`}>
              {m.sender === "bot" ? (
                <ReactMarkdown>{m.text}</ReactMarkdown>
              ) : (
                m.text
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
