import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'them', text: 'Hey Subham! Are you joining the Meghalaya backpacking trip next week?', time: '10:30 AM' },
    { id: '2', sender: 'me', text: 'Hey Ananya! Yes, I just completed my booking with Himalayan Explorers!', time: '10:32 AM' },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), sender: 'me', text: inputMsg.trim(), time: 'Just now' }]);
    setInputMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-2.5">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" alt="Chat User" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <h3 className="text-xs font-extrabold text-[#0F172A]">Ananya Sharma</h3>
              <p className="text-[10px] font-semibold text-emerald-600">Online</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <button className="p-2 rounded-full hover:bg-slate-100"><Phone className="w-4 h-4" /></button>
          <button className="p-2 rounded-full hover:bg-slate-100"><Video className="w-4 h-4" /></button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-3 pb-24 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[80%] space-y-1 ${m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                m.sender === 'me' ? 'bg-[#FF4D6D] text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] font-bold text-slate-400 px-1">{m.time}</span>
          </div>
        ))}
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 p-3">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-4 py-3 text-xs font-semibold text-[#0F172A] focus:outline-none focus:bg-white"
          />
          <button type="submit" className="p-3 rounded-full bg-[#FF4D6D] text-white shadow-md shadow-[#FF4D6D]/20">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
