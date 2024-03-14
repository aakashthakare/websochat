export type UserId = string;

export interface Chat {
    id: string;
    userId: string;
    name: string;
    message: string;
    upvotes: UserId[];
    downvotes: UserId[];
}

export abstract class Store {
    constructor() {}

    initRoom(roomId: string) {}

    getChats(room: string, limit:number, offset:number) {

    }

    addChat(userId: UserId, name: string, message: string, room: string, limit:number, offset:number) {
        
    }
    upvote(userId: UserId, roomId: string, chatId: string){

    }

    downvote(userId: UserId, roomId: string, chatId: string){

    }


}