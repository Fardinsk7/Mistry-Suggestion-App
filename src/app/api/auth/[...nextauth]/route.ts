import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

//here in next js since api endpoint already handled so we have to export it like GET and POST
export {handler as GET, handler as POST}