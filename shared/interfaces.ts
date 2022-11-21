import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

import { Role } from './enums'

export interface MetaData {
  created?: Date
  updated?: Date
}

export interface Login {
  email: string
  password?: string
}

export interface User extends MetaData {
  firstname: string
  lastname: string
  email: string
  role: Role
  password?: string
}
export interface Employer extends User {
  company: string
}
export interface Employee extends User {
  profile: string
}
export interface Job extends MetaData {
  employer: string | ObjectId
  name: string
  description: string
  requirements: string
}

export interface Negotiation extends MetaData {
  employer: string | ObjectId | Employer
  employee: string | ObjectId | Employee
  job: string | ObjectId | Job
  hasApplied?: boolean
  isInvited?: boolean
  hasAccepted?: boolean
}

export interface Payload extends JwtPayload {
  role: Role
}
