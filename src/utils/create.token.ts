import { WithId } from 'mongodb'
import { sign, JwtPayload } from 'jsonwebtoken'

import { User } from '../../shared'
import { findOneUser } from '../services/mongodb.user.service'

export const createToken = async ({ email, role }: User, expires: Date): Promise<string> => {
  const { SIGN_KEY }: { [key: string]: string } = process.env

  const user: WithId<User> = await findOneUser({ email })
  const payload: JwtPayload = {
    aud: 'www.jobs.com',
    exp: expires.getTime(),
    iat: new Date().getTime(),
    iss: 'www.jobs.com',
    jti: user._id.toString(),
    sub: user.email,
    role
  }

  return sign(payload, SIGN_KEY, { algorithm: 'HS256' })
}
