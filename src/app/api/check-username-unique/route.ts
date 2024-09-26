import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


//Here we are building username validation because when user is searching for the particular username while deciding a username then instead of using another signup Validation we are creating this endpoint specifically to check the username and validate it 
const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request:Request){
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        }
        //Validating username from zod
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log("Result of zod validation: ",result) //TODO: Remove
        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];// Here in this result error it could have error of other like signup and signin so we are removing username error specifically
            return Response.json({
                success:false,
                message: usernameError?.length>0?usernameError.join(", "):"Invalid query parameters"
            },{status: 400})
        }

        const {username} = result.data;
        const existingVerifiedUser= await UserModel.findOne({username, isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message: "Username Already taken",
            },{status:400})
        }
        return Response.json({
            success:true,
            message:"Username Exist",
        },{status:200})

    } catch (error) {
        console.error("Unable to Valid UserName: ", error);
        return Response.json({
            success:false,
            message:"Error Validating Username"
        },{status:500})
    }
}