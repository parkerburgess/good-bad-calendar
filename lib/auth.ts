import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'

async function getPayload() {
  const token = (await cookies()).get('auth_token')!.value
  return decodeJwt(token)
}

export async function getUserId(): Promise<string> {
  return (await getPayload()).sub!
}

export async function getUserName(): Promise<string> {
  const payload = await getPayload()
  return (payload.name as string | undefined) ?? (payload.email as string | undefined) ?? ''
}
