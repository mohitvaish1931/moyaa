import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware for future auth protection if needed
  // Currently using direct auth (no JWT)
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
