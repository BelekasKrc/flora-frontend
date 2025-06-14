import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('female'); // Default avatar
  const messagesEndRef = useRef(null);

  // Scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch initial greeting from backend on mount
  useEffect(() => {
    fetch('https://yourfloraassistant.onrender.com/api/greeting')
      .then(res => res.json())
      .then(data => setMessages([{ sender: 'flora', text: data.greeting }]))
      .catch(() =>
        setMessages([{ sender: 'flora', text: "Hey there 🌼 I'm Flōra. What's on your mind today?" }])
      );
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'you', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://yourfloraassistant.onrender.com/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'flora', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'flora', text: 'Error talking to Flora.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-red-600 text-white text-center py-4 text-2xl font-bold shadow">
        Flōra AI
      </div>

      {/* Avatar picker */}
      <div className="flex justify-center space-x-4 py-2 bg-red-100">
        <button
          className={`px-4 py-2 rounded ${avatar === 'male' ? 'bg-red-600 text-white' : 'bg-white'}`}
          onClick={() => setAvatar('male')}
          aria-label="Select Male Avatar"
        >
          👨 Male
        </button>
        <button
          className={`px-4 py-2 rounded ${avatar === 'female' ? 'bg-red-600 text-white' : 'bg-white'}`}
          onClick={() => setAvatar('female')}
          aria-label="Select Female Avatar"
        >
          👩 Female
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow flex items-center space-x-2 ${
              msg.sender === 'you' ? 'bg-red-600 text-white self-end' : 'bg-gray-200 text-black self-start'
            }`}
          >
            {msg.sender === 'flora' && (
              <span className="text-2xl">{avatar === 'male' ? '👨' : '👩'}</span>
            )}
            <span>{msg.text}</span>
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">Flōra is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white shadow-md flex items-center">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Flōra..."
          aria-label="Message input"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
