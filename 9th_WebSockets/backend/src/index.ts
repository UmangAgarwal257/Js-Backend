import { WebSocketServer , WebSocket} from "ws";

const wss = new WebSocketServer({port : 8080})

interface User {
    socket : WebSocket;
    room : string;
}

let users : User[] = [];

wss.on("connection" , function(socket){

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString())
        if(parsedMessage.type === "join"){
            console.log("user joined room" + parsedMessage.payload.roomId)
            users.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type == "chat"){
            console.log("user wants to chat")
            const currentUserRoom = users.find((x) => x.socket == socket)
            users.forEach(user => {
                if(user.room === currentUserRoom?.room){
                    user.socket.send(parsedMessage.payload.message)
                }
            })
        }
    })
        
    socket.on("disconnect", () => {

    })
})
        