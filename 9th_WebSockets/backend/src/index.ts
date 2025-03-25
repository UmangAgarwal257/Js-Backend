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

            // Notify others in the room
            users.forEach((user) => {
                if (user.room === parsedMessage.payload.roomId && user.socket !== socket) {
                    user.socket.send(JSON.stringify({
                        type: 'notification',
                        payload: { message: `A user has joined the room: ${parsedMessage.payload.roomId}` }
                    }));
                }
            });
        }

        if(parsedMessage.type === "chat"){
            console.log("user wants to chat")
            const currentUserRoom = users.find((x) => x.socket === socket)
            if (currentUserRoom) {
                users.forEach((user) => {
                    if(user.room === currentUserRoom.room){
                        user.socket.send(JSON.stringify({
                            type: 'chat',
                            payload: { message: parsedMessage.payload.message }
                        }));
                    }
                })
            }
        }
    })
        
    socket.on("close", () => {
        // Notify others in the room
        const userIndex = users.findIndex((user) => user.socket === socket);
        if (userIndex !== -1) {
            const userRoom = users[userIndex].room;
            users.splice(userIndex, 1); // Remove the user from the list
            users.forEach((user) => {
                if (user.room === userRoom) {
                    user.socket.send(JSON.stringify({
                        type: 'notification',
                        payload: { message: `A user has left the room: ${userRoom}` }
                    }));
                }
            });
        }
    })
})
        