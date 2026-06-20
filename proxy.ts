import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'

const WANDERING_PARKER_URL = process.env.WANDERING_PARKER_URL ?? 'http://localhost:3000'

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001'}/api/auth/jwks`)
)

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL(WANDERING_PARKER_URL))
  }

  /*
  try {
    await jwtVerify(token, JWKS)
    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL(WANDERING_PARKER_URL))
    response.cookies.delete('auth_token')
    return response
  }
    */
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
