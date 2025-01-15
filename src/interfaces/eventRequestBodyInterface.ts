import { Event } from "./eventInterface.js"

export interface EventRequestBody extends Event {
    userId: string
}