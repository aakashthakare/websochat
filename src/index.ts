import {server as WebSocketServer, connection} from "websocket"
import http from 'http';
import { IncomingMessage, SupportedMessage } from "./messages/IncomingMessages";
import { UserManager } from "./manager/UserManager";
import { InMemoryStore } from "./store/InMemoryStore";
import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessages } from "./messages/OutgoingMessages";

const userManager = new UserManager();
const store = new InMemoryStore();

const server = http.createServer(function(request:any, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin: any) {
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {

            try {
                console.log(message.utf8Data)
                messageHandler(connection, JSON.parse(message.utf8Data))
            } catch(e) {
                console.error(e);
                console.log("Failed to handle the message.")
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function messageHandler(ws: connection, message: IncomingMessage) {
    if(message.type == SupportedMessage.JoinRoom) {
        console.log("User Joined.");
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws)
    }

    if(message.type == SupportedMessage.SendMessage) {
        const payload = message.payload;
        
        const user = userManager.getUser(payload.userId, payload.roomId);
        if(!user) {
            console.log("User not found in database");
            return;
        }
    
        let chat = store.addChat(payload.userId, user.name, payload.roomId, payload.message);

        if(!chat) return;

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.AddChat,
            payload: {
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0,
                downvotes: 0,
                chatId: chat.id
            }
        }
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload)
    }

    if(message.type == SupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        const chat = store.upvote(payload.userId, payload.roomId, payload.chatId);
        
        if(!chat) return;

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.UpdateChat,
            payload: {
                roomId: payload.roomId,
                chatId: payload.chatId,
                upvotes: chat.upvotes.length,
                downvotes: chat.downvotes.length
            }
        }
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }

    if(message.type == SupportedMessage.DownvoteMessage) {
        const payload = message.payload;
        const chat = store.downvote(payload.userId, payload.roomId, payload.chatId);
        
        if(!chat) return;

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.UpdateChat,
            payload: {
                roomId: payload.roomId,
                chatId: payload.chatId,
                upvotes: chat.upvotes.length,
                downvotes: chat.downvotes.length
            }
        }
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }

    if(message.type == SupportedMessage.DownvoteMessage || 
        message.type == SupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        const chat = store.findTopChat(payload.roomId);
        
        if(!chat) return;

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.UpdateTopChat,
            payload: {
                roomId: payload.roomId,
                chatId: payload.chatId,
                upvotes: chat.upvotes.length,
                downvotes: chat.downvotes.length,
                message: chat.message,
                name: chat.name
            }
        }

        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }
}