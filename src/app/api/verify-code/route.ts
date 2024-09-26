import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {verifySchema} from "@/schemas/verifySchema";
import {z} from "zod";

const verifySchemaQuery = z.object({
    code:verifySchema,
})

export async function POST(request:Request){
    await dbConnect();
    try {
        const {username, code} = await request.json();
        console.log(code)
        const decodeUsername = decodeURIComponent(username);// here we are decoding username because it is good practice in nextjs to decode parameter coming from url
        console.log("Decoded Username: ",decodeUsername);
        const zodValidatingOfCode = {
            code: code
        }
        const result = verifySchemaQuery.safeParse({code: zodValidatingOfCode});
        if(!result.success){
            const codeValidatingErrors = result.error.format().code?.code?._errors || [];
            return Response.json({
                success:false,
                message: codeValidatingErrors.length>0? codeValidatingErrors.join(", "):"Invalid Code Params"
            },{status: 400})
            
        }

        const user = await UserModel.findOne({
            username:decodeUsername,
        })

        if(!user){
            return Response.json({
                success:false,
                message:"User Not Found"
            },{status:404})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success:true,
                message:"User verified successfully",
            },{status:200})
        }else if(!isCodeExpired){
            return Response.json({
                success:false,
                message:"Verification Code is Expired, Please signup again to get a new code",
            },{status:400})// 400 code says client side bad request
        }else{
            return Response.json({
                success:false,
                message:"Incorrect Verification Code",
            },{status:400})
        }
        
    } catch (error) {
        console.error("Error in Validating Verification code", error);
        return Response.json({
            success: false,
            message: "Error in Validating Verification code ",
        },{status:500})
    }
}