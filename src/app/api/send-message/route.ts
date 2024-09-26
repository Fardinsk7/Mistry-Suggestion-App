import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {Message} from "@/model/User";

export async function POST(request: Request){
    await dbConnect()
    try {
        const {username, content} = await request.json();
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success:false,
                message:"User Not Found"
            },{status: 404})
        }
        //checking if user is accepting message or not
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User Not Accepting Messages"
            },{status: 401})// code 401 means forbidden request
        }
        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save()
        return Response.json({
            success:true,
            message:"Message Sent Successfully"
        },{status: 200})
    } catch (error) {
        console.error("Error in sending Message",error)
        return Response.json({
            success:false,
            message:"Error in sending Message"
        },{status: 500})
    }
}