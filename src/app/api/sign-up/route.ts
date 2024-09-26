import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()
    try {
        //In Next js we should always have to use "await" to get data from request.json()
        const {username, email, password} = await request.json()

        let existingUserWithEmail = await UserModel.findOne({email});
        let existingUserWithUsername;
        
        if(existingUserWithEmail){
            if(existingUserWithEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User with this Email Already Exist"
                },{status:400})
            }
        }else{
            existingUserWithUsername = await UserModel.findOne({username,isVerified:false})
        }

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        const hashedPassword = await bcrypt.hash(password,10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours()+1);

        if(existingUserWithUsername){
            existingUserWithUsername.email = email;
            existingUserWithUsername.password = hashedPassword;
            existingUserWithUsername.verifyCode = verifyCode;
            existingUserWithUsername.verifyCodeExpiry = expiryDate;
            await existingUserWithUsername.save();

        }else{
            existingUserWithUsername = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
            await existingUserWithUsername.save();
        }

        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        if(!emailResponse.success){
            console.log(emailResponse)
            return Response.json({
                success:false,
                message: "Error in sending verification code "+emailResponse.message
            },{status:500})
        }
        console.log(username, email,password)
        console.log("Email Sent: ",emailResponse)

        return Response.json({
            success:true,
            message:"User Register Successfull, Please verify your email"
        },{status:201})

    } catch (error) {
        console.log("Error registring User: ", error)
        return Response.json(
            {
            success:false,
            message:"Error registring User"
            },
            {
            status:500,
            }
    )
    }
}