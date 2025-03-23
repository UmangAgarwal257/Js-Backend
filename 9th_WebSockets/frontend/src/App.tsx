import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function sendMessage() {
    if(!socket) return;
    if(!inputRef.current) return;
    const message = inputRef.current.value;
    socket.send(message)
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    setSocket(ws)

    ws.onmessage = (e) => {
      alert(e.data)
    }

  }, [])
  

  return (
    <>
    <input ref = {inputRef} type="text" placeholder='Message ...' id="" />
    <button onClick={sendMessage}>Send</button>
    </>
  )
}

export default App
