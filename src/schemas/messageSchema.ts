import {z} from "zod";


export const messageSchema = z.object({
    username:z.string().min(2, { message: 'Username is required to send message' }),
    content: z.string().min(10,{message:"Content Must be of atleast 10 character"}).max(300,{message:"Content Must be of no more than 300 character"})
})