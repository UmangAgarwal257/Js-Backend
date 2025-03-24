import { WebSocketServer , WebSocket} from "ws";

const wss = new WebSocketServer({port : 8080})

let allSockets : WebSocket[] = [];

wss.on("connection" , function(socket){
    allSockets.push(socket);
    console.log("user connected # " + allSockets.length)
    socket.on("message", (e) => {
        console.log("message received " + e.toString())
        allSockets.forEach(s => {
            s.send("user"+ allSockets.length + " : " + e.toString())
        })
    })

    socket.on("close", () => {
        allSockets = allSockets.filter(x => x !== socket)
        console.log("user disconnected, remaining users: " + allSockets.length)
    })
})
