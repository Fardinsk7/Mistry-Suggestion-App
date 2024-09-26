import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from "next-auth/middleware"// The most simple usage is when you want to require authentication for your entire site. You can add a middleware.js file with the following:
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request});
    const url = request.nextUrl
    if(token &&(
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')||
        url.pathname.startsWith('/')
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/sign-in',request.url));
    }

  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
    //This is say the endpoint where middlware will run
    matcher: ['/sign-in','sign-up','/','/dashboard/:path*','/verify/:path*'],
}