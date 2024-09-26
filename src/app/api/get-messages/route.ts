import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import {User} from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status: 401})
    }

    const userId= new mongoose.Types.ObjectId(user._id);//Here we have store _id in the form of string in session thats why while retriveing user id from sessioin we are converting _id back into mongodb ObjectId. we are doing is here specially becuse .findById and all such method handle _id in string format but while doing aggregation in mongodb it would not support it that why before aggregation we are converting _id into mongodb ObjectId
    try {
        //Here we created aggregation pipeline
        //here instead of returning just returning messages array we are using aggregation pipeline because if there are thousands of message in message array then to manipulate and filter message array it would be best approach means for scalability it is best approach
        const user = await UserModel.aggregate([
            {$match:{_id: userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        console.log("User :",user)
        if(user.length === 0){
            return Response.json({
                success: false,
                message: "No Message Availbale to display add message to be display"
            },{status:401})
        }
        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message:"User Not Found"
            },{status: 404})
        }
        return Response.json({
            success:true,
            messages: user[0].messages
        },{status: 200})
    } catch (error) {
        console.error("Error in Getting Messages",error)
        return Response.json({
            success:false,
            message:"Error in Getting Messages"
        },{status: 500})
    }   
}