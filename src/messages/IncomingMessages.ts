import z from "zod";

export type IncomingMessage = {
    type: SupportedMessage.JoinRoom,
    payload: InitMessageType
} | {
    type: SupportedMessage.SendMessage,
    payload: UserMessageType
} | {
    type: SupportedMessage.UpvoteMessage,
    payload: UpvoteMessageType
} | {
    type: SupportedMessage.DownvoteMessage,
    payload: DownvoteMessageType
}

export enum SupportedMessage {
    JoinRoom =  "JOIN_ROOM",
    SendMessage = "SEND_MESSAGE",
    UpvoteMessage = "UPVOTE_MESSAGE",
    DownvoteMessage = "DOWNVOTE_MESSAGE"
}


export const InitMessage = z.object({
    name: z.string(),
    userId: z.string(),
    roomId: z.string()
})

export type InitMessageType = z.infer<typeof InitMessage>;

export const UserMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    message: z.string()
})

export type UserMessageType = z.infer<typeof UserMessage>;

export const UpvoteMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    chatId: z.string()
})

export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;

export const DownvoteMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    chatId: z.string()
})

export type DownvoteMessageType = z.infer<typeof DownvoteMessage>;