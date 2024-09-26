import NextAuth from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text", },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any):Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user exists with this email");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user
                    }
                    else{
                        throw new Error("Password is Incorrect")
                    }
                } catch (err:any) {
                    throw new Error(err);
                }
            }

            
        })
    ],
    pages:{
        signIn: '/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async jwt({token,user}){
            if(user){
                //Here in jwt user(next-auth define user) has it own interface which does not consist of _id that why we redefine user interface in types folder under next-auth.d.ts
                token._id = user._id?.toString()// Here we are converting _id to string because  we want to convert Object Id to string
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username= user.username
            }
            return token //Here always remember jwt callback return token which help us to avoid error
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        }
    }
}
