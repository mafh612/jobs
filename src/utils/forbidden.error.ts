import { HttpStatus } from 'http-enums'

export class ForbiddenError extends Error {
  name: string = HttpStatus.FORBIDDEN.toString()
  message: string = 'access not allowed'
}
