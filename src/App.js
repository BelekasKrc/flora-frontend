import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'flora', text: "Hey there 🌼 I'm Flōra. What's on your mind today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ message: input })
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
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${
              msg.sender === 'you' ? 'bg-red-600 text-white self-end' : 'bg-gray-200 text-black self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">Flōra is typing...</div>}
      </div>
      <div className="p-4 bg-white shadow-md flex items-center">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Flōra..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
