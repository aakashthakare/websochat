import z from "zod";

export type IncomingMessage = {
    type: SupportedMessageTypes.JoinRoom,
    payload: InitMessageType
} | {
    type: SupportedMessageTypes.SendMessage,
    payload: UserMessageType
} | {
    type: SupportedMessageTypes.UpvoteMessage,
    payload: UpvoteMessageType
}

export enum  SupportedMessageTypes {
    JoinRoom = "JOIN_ROOM",
    SendMessage = "SEND_MESSAGE",
    UpvoteMessage = "UPVOTE_MESSAGE"
}

const InitMessage = z.object({
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
    message: z.string()
})

export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;