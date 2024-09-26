import mongoose, {Schema, Document} from "mongoose";

//Message Schema interface and design
export interface Message extends Document{
    _id:string;
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> =  new Schema({
    content:{
        type: String,
        required:true,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

//User Schema interface and design

export interface User extends Document{
    username: string;
    email:string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> =  new Schema({
   username:{
    type:String,
    required: [true, "Username is required"],
    trim: true,
    // unique: true,
   },
   email:{
    type: String,
    required:[true, "Email is required"],
    // unique:true,
    match:[/.+\@.+\..+/, "Please provide a valid email"]
   },
   password:{
    type: String,
    required:[true, "Email is required"],
   },
   verifyCode:{
    type:String,
    required:[true, "Verify Code is require"]
   },
   verifyCodeExpiry:{
    type:Date,
    required:[true, "Verify Code Expiry is require"]
   },
   isVerified:{
    type:Boolean,
    default: false,
   },
   isAcceptingMessage:{
    type:Boolean,
    default: true,
   },
   messages:[MessageSchema]
})

//Developing Server is next js and normal node js/express is different that is why we are exporting in different way in next js
// The difference is that in node js normal server when we deployed  and starts it, server keeps ongoing not end but in next js server keep on starting again and again that why we should have to check whether is schema is already created or we should have to create one if created that then ok or not then create one

//here first we are checking that model is already created or not and second if not created then create one
const UserModel = (mongoose.models.User as mongoose.Model<User>)||(mongoose.model<User>("User",UserSchema))

export default UserModel;