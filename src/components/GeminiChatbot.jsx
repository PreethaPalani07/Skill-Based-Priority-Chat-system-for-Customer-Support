import { useState, useRef, useEffect } from "react";
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Jarvis, an intelligent AI customer support assistant for SupportDesk. 
You help customers with their issues related to login, payments, orders, refunds, and technical problems.
Keep responses short, friendly and helpful. 
If the customer needs human help, say "Let me connect you to a human agent".
Always respond in the same language the customer uses.`;

const GeminiChatbot = ({ onEscalateToAgent, customerName }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi ${customerName || "there"}! 👋 I am Jarvis, your AI support assistant powered by Google Gemini. I can answer any question you have. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatHistoryRef = useRef([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      setTimeout(() => sendMessage(text), 500);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    const applyVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v =>
        v.name.includes("Google") ||
        v.name.includes("Microsoft") ||
        v.lang === "en-US"
      );
      if (preferred) utterance.voice = preferred;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = applyVoice;
    } else {
      applyVoice();
    }
  };

  const startListening = () => {
    if (isListening) return;
    setIsListening(true);
    try {
      recognitionRef.current?.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const sendMessage = async (messageText) => {
    const userMessage = messageText || input.trim();
    if (!userMessage) return;
    setInput("");

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);

    chatHistoryRef.current.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    setLoading(true);

    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: chatHistoryRef.current,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      });

      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I am sorry, I could not process that. Please try again.";

      chatHistoryRef.current.push({
        role: "model",
        parts: [{ text: botReply }],
      });

      setMessages(prev => [...prev, { role: "assistant", text: botReply }]);
      speak(botReply);

      if (
        botReply.toLowerCase().includes("human agent") ||
        botReply.toLowerCase().includes("connect you to")
      ) {
        setTimeout(() => {
          if (onEscalateToAgent) onEscalateToAgent();
        }, 3000);
      }

    } catch (err) {
      console.error("Gemini error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "I am having trouble connecting right now. Please try again!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", background: "transparent",
    }}>

      {/* Speaking Banner */}
      {isSpeaking && (
        <div style={{
          background: "rgba(251,191,36,0.08)",
          borderBottom: "1px solid rgba(251,191,36,0.2)",
          padding: "0.5rem 1rem",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  width: "3px", height: `${6 + i * 3}px`,
                  background: "var(--warning)", borderRadius: "2px",
                  animation: `spin 0.${i}s ease infinite`,
                }} />
              ))}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--warning)" }}>
              🔊 Jarvis is speaking...
            </p>
          </div>
          <button onClick={stopSpeaking} style={{
            padding: "0.2rem 0.6rem", borderRadius: "6px",
            border: "1px solid rgba(251,191,36,0.4)",
            background: "rgba(251,191,36,0.1)",
            color: "var(--warning)", cursor: "pointer", fontSize: "0.75rem",
          }}>Stop</button>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "1rem",
        display: "flex", flexDirection: "column", gap: "0.75rem",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{ maxWidth: "78%" }}>
              {msg.role === "assistant" && (
                <p style={{
                  fontSize: "0.7rem", color: "var(--success)",
                  marginBottom: "0.25rem", paddingLeft: "0.5rem"
                }}>
                  🤖 Jarvis AI (Gemini)
                </p>
              )}
              <div style={{
                padding: "0.75rem 1rem",
                borderRadius: msg.role === "user"
                  ? "18px 18px 4px 18px"
                  : "18px 18px 18px 4px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                  : "rgba(52,211,153,0.1)",
                border: msg.role === "assistant"
                  ? "1px solid rgba(52,211,153,0.3)" : "none",
                color: msg.role === "user" ? "var(--primary)" : "var(--text)",
                fontSize: "0.875rem", lineHeight: "1.6", whiteSpace: "pre-wrap",
              }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "0.75rem 1rem",
              borderRadius: "18px 18px 18px 4px",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.3)",
              display: "flex", gap: "0.3rem", alignItems: "center",
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "var(--success)",
                  animation: `spin 1s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "0.75rem 1rem",
        borderTop: "1px solid var(--border)",
        background: "rgba(15,23,42,0.9)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "🎤 Listening..." : "Ask Jarvis anything..."}
            rows={1}
            style={{
              flex: 1, background: "rgba(30,41,59,0.8)",
              border: `1px solid ${isListening ? "var(--danger)" : "var(--border)"}`,
              borderRadius: "14px", padding: "0.75rem 1rem",
              color: "var(--text)", fontSize: "0.875rem",
              outline: "none", resize: "none", maxHeight: "100px",
              lineHeight: "1.5", fontFamily: "'DM Sans', sans-serif",
            }}
          />

          <button
            onClick={startListening}
            disabled={loading || isSpeaking}
            style={{
              width: "44px", height: "44px", borderRadius: "12px",
              border: "none",
              background: isListening
                ? "linear-gradient(135deg, var(--danger), #dc2626)"
                : "linear-gradient(135deg, #818cf8, #c084fc)",
              color: "white", cursor: "pointer", fontSize: "1.1rem",
              display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0,
            }}
          >
            {isListening ? "⏹" : "🎤"}
          </button>

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: "44px", height: "44px", borderRadius: "12px",
              border: "none",
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #34d399, #059669)"
                : "var(--border)",
              color: input.trim() && !loading ? "white" : "var(--text-muted)",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              fontSize: "1.1rem", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >➤</button>
        </div>
        <p style={{
          fontSize: "0.68rem", color: "var(--text-muted)",
          marginTop: "0.4rem", textAlign: "center",
        }}>
          🤖 Powered by Google Gemini AI • 🎤 Voice enabled • Ask anything!
        </p>
      </div>
    </div>
  );
};

export default GeminiChatbot;