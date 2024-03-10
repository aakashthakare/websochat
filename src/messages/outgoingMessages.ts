export enum SupportedMessage {
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT"
}

type MessagePayload = {
    roomId: string;
    name: string;
    message: string;
    upvotes: number;
    chatId: string;
}

export type OutgoingMessage = {
    type: SupportedMessage.AddChat
    payload: MessagePayload
} | {
    type: SupportedMessage.UpdateChat
    payload: Partial<MessagePayload>
}