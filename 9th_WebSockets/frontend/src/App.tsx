import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState<string>('');
  const [isJoined, setIsJoined] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function joinRoom() {
    if (!socket || !room) return;
    socket.send(JSON.stringify({
      type: 'join',
      payload: { roomId: room }
    }));
    setIsJoined(true);
  }

  function sendMessage() {
    if (!socket || !inputRef.current?.value || !isJoined) return;
    const message = inputRef.current.value;
    socket.send(JSON.stringify({
      type: 'chat',
      payload: { message }
    }));
    inputRef.current.value = '';
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    setSocket(ws)

    ws.onmessage = (e) => {
      setMessages(prev => [...prev, e.data]);
    }

    ws.onclose = () => {
      setIsJoined(false);
      setSocket(null);
    }

    return () => ws.close();
  }, [])
  
  return (
    <div className="chat-container">
      {!isJoined ? (
        <div className="join-container">
          <input 
            type="text" 
            placeholder="Enter room ID" 
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <>
          <div className="room-info">Room: {room}</div>
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
        </>
      )}
    </div>
  )
}

export default App
