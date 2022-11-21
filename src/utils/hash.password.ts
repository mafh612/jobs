import { createHash } from 'crypto'

import { User } from '../../shared'

export const hashPassword = (user: User): User => ({ ...user, password: createHash('SHA256').update(user.password).digest('base64') })
