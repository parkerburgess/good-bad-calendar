import { NextRequest, NextResponse } from 'next/server'
import { createRemoteJWKSet, jwtVerify } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001'}/api/auth/jwks`)
)

const WANDERING_PARKER_URL = process.env.WANDERING_PARKER_URL ?? 'http://localhost:3000'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  if (!token) {
    if (isApiRoute) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.redirect(new URL('/login', WANDERING_PARKER_URL))
  }

  try {
    await jwtVerify(token, JWKS)
    return NextResponse.next()
  } catch {
    if (isApiRoute) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const response = NextResponse.redirect(new URL('/login', WANDERING_PARKER_URL))
    response.cookies.delete('auth_token')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
