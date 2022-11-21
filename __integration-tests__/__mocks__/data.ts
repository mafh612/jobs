import { Employee, Employer, Job, Role } from '../../shared'

export const employer: Employer = {
  email: 'e.test',
  password: '123456',
  firstname: 'Eva',
  lastname: 'Test',
  role: Role.EMPLOYER,
  company: 'company'
}
export const employer2: Employer = {
  email: 'c.test',
  password: '123456',
  firstname: 'Claudia',
  lastname: 'Test',
  role: Role.EMPLOYER,
  company: 'company2'
}
export const employee: Employee = {
  email: 'a.test',
  password: '123456',
  firstname: 'Adam',
  lastname: 'Test',
  role: Role.EMPLOYEE,
  profile: 'Employee profile'
}
export const job1: Job = {
  name: 'Job 1',
  employer: undefined,
  description: 'Job description',
  requirements: 'Job requirements'
}
export const job2: Job = {
  name: 'Job 2',
  employer: undefined,
  description: 'Job description',
  requirements: 'Job requirements'
}
