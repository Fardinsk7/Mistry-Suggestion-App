import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

//emails function are always async 
export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        console.log("Email from email:", email)
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mistry App | Verification Code',
            react: VerificationEmail({username,otp:verifyCode}),
        })
        return {success:true,message:"Verification email send successfully"}
    } catch (emailError) {
        console.log("Error sending Verification Email", emailError)
        return {success:false,message:"Failed to send verification email"}
    }

}
