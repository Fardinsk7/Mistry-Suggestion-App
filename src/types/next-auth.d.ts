import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth'{
    interface User{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string;
        }&DefaultSession['user'] //here we are saying that by default atleast user key will come in session
    }
}

//Here it is another way of defining interface 
declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
}