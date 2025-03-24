import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function sendMessage() {
    if(!socket) return;
    if(!inputRef.current) return;
    const message = inputRef.current.value;
    socket.send(message);
    inputRef.current.value = '';
  }

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8080")
    setSocket(ws)

    ws.onmessage = (e) => {
      setMessages(prev => [...prev, e.data]);
    }

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    }

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    }

    return () => {
      ws.close();
    }
  }, [])
  
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input ref={inputRef} type="text" placeholder='Message ...' />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default App
