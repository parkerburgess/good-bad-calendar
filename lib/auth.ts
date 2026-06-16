import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'

export async function getUserId(): Promise<string> {
  const token = (await cookies()).get('auth_token')!.value
  const payload = decodeJwt(token)
  return payload.sub!
}
