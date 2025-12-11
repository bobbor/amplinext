import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {fetchAuthSession} from 'aws-amplify/auth/server'
import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";

const mkRedirect = (req: NextRequest) => (relativeUrl: string) => {
  const url = new URL(relativeUrl, req.url);
  return NextResponse.redirect(url);
}

export default async function proxy(request: NextRequest) {
  const redirect = mkRedirect(request);
  const isLogin = request.nextUrl.pathname === "/login";
  const isAuthenticated = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch(e) {
        return false;
      }
    }
  });

  if(!isAuthenticated && !isLogin) {
    return redirect('/login');
  } else if(isAuthenticated && isLogin) {
    return redirect('/');
  }
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$|.*\\.map$).*)',
  ],
}