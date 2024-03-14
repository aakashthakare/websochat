import { Chat, Store, UserId } from "./Store";

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

    addChat(userId: UserId, name: string, roomId: string, message: string) {
        if(!this.store.get(roomId)) {
            this.initRoom(roomId);
        }
        const room = this.store.get(roomId);
        if(!room) {
            return;
        }
        const chat = {
            id: (globalChatId++).toString(),
            userId,
            name,
            message,
            upvotes: [],
            downvotes: []
        }
        room.chats.push(chat);
        return chat;
    }

    upvote(userId: UserId, roomId: string, chatId: string) {
        const room = this.store.get(roomId);
        if(!room) {
            return
        }
        const chat = room.chats.find(({id}) => id == chatId);

        if(chat) {
            chat.upvotes.push(userId);
        }
        return chat;
    }

    downvote(userId: UserId, roomId: string, chatId: string) {
        const room = this.store.get(roomId);
        if(!room) {
            return
        }
        const chat = room.chats.find(({id}) => id == chatId);

        if(chat) {
            chat.downvotes.push(userId);
        }
        return chat;
    }

    findTopChat(roomId: string) {
        const room = this.store.get(roomId);
        let topVotes = -1;
        let topChatId: string | Chat | null = null;

        room?.chats.forEach(chat => {
            const votes = Math.abs(chat.upvotes.length - chat.downvotes.length);
            if(votes > topVotes ) {
                topVotes = votes;
                topChatId = chat.id;
            }
        });
        
        
        if(!topChatId) {
            return;
        }

        return room?.chats.find(({id}) => id == topChatId);;
    }

}