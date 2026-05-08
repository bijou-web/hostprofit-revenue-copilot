"use client";
import { useState } from "react";
import { RevenueAuditCard } from "../components/RevenueAuditCard";

type Message = { role: string; content: string } | { role: "card"; data: any };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMessage = { role: "user", content: msg };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const textMessages = newMessages.filter((m): m is { role: string; content: string } => "content" in m);
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: textMessages }) });
    const data = await res.json();

    if (data.type === "card") {
      setMessages([...newMessages, { role: "card", data: data.data }]);
    } else {
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui" }}>
      <div style={{ flex: 1, padding: 40, borderRight: "1px solid #eee" }}>
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>HostProfit Revenue Copilot</h1>
        <p style={{ color: "#666", marginTop: 8 }}>The Bloomberg Terminal for STR operators.</p>
        <div style={{ marginTop: 32, padding: "16px 20px", background: "#f6f5f1", borderRadius: 8 }}>
          <div style={{ fontWeight: 500, marginBottom: 12 }}>Try these:</div>
          <div style={{ color: "#555", marginBottom: 10, cursor: "pointer", padding: "8px 12px", background: "#fff", borderRadius: 6, border: "1px solid #eee" }} onClick={() => send("Audit my Maui Banyan G110 listing")}>→ Audit my Maui Banyan G110 listing</div>
          <div style={{ color: "#555", cursor: "pointer", padding: "8px 12px", background: "#fff", borderRadius: 6, border: "1px solid #eee" }} onClick={() => send("Audit my USVI villa")}>→ Audit my USVI villa — $174K opportunity</div>
        </div>
        <div style={{ marginTop: 24, color: "#888", fontSize: 13 }}>42 listings · USVI · Maui · Napa · Miami · Paris · South of France</div>
      </div>
      <div style={{ width: 520, display: "flex", flexDirection: "column", borderLeft: "1px solid #eee" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #eee", fontWeight: 500, fontSize: 15 }}>HostProfit Revenue Copilot</div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {messages.length === 0 && <div style={{ color: "#999", fontSize: 14 }}>Click a listing on the left to run a live revenue audit...</div>}
          {messages.map((m, i) => {
            if ("data" in m) {
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <RevenueAuditCard {...m.data} />
                </div>
              );
            }
            return (
              <div key={i} style={{ marginBottom: 16, textAlign: m.role === "user" ? "right" : "left" }}>
                <div style={{ display: "inline-block", maxWidth: "85%", padding: "10px 14px", borderRadius: 10, background: m.role === "user" ? "#1a1a1a" : "#f6f5f1", color: m.role === "user" ? "#fff" : "#1a1a1a", fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            );
          })}
          {loading && <div style={{ color: "#999", fontSize: 14 }}>Auditing your listing...</div>}
        </div>
        <div style={{ padding: 16, borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask me to audit a listing..." style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
          <button onClick={() => send()} disabled={loading} style={{ padding: "10px 20px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Send</button>
        </div>
      </div>
    </div>
  );
}
