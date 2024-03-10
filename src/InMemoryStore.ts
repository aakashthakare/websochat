import { Chat, Store, UserId } from "./store/Store";

let globalChatId = 0;

export interface Room {
    roomId: string;
    chats: Chat[]
}

export  class InMemoryStore implements Store {
    private store: Map<string, Room>;

    constructor() {
        this.store = new Map<string, Room>();
    }

    initRoom(roomId: string) {
        this.store.set(roomId, {
            roomId,
            chats: [] 
        });
    }

    getChats(roomId: string, limit:number, offset:number) {
        const room = this.store.get(roomId);
        if(!room) {
            return []
        }
        
        return room.chats.reverse().slice(0, offset).slice(-1 * limit);

    }

    addChat(userId: UserId, name: string, message: string, roomId: string, limit:number, offset:number) {
        const room = this.store.get(roomId);
        if(!room) {
            return
        }
        room.chats.push({
            chatId: (globalChatId++).toString(),
            userId,
            name,
            message,
            upvotes: []
        })
    }

    upvote(roomId: string, chatId: string) {}

}