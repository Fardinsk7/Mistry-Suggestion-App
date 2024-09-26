import mongoose from "mongoose";

type ConnectObject={
    isConnected?:number;
}

const connection: ConnectObject = {};

//
async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already Connected with database");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "",{});
        // console.log("Just to see db: db: ",db);
        // console.log("Just to see db.connections: db.connections: ",db.connections);
        connection.isConnected = db.connections[0].readyState;
        console.log("Connection with database successfull");
    } catch (error) {
        console.log("Database connection Failed: ",error)
        process.exit(1)//Here it is a good practice that it will exit database gracefully because if database doesnot connnect then our application will not work
    }
}

export default dbConnect;