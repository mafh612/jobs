import _pick from 'lodash.pick'
import Axios, { AxiosInstance } from 'axios'
import { Job, Negotiation } from '../../shared'
import { DeleteResult, InsertOneResult, UpdateResult } from 'mongodb'
import { employee, employer2 as employer, job1 as job } from '../__mocks__/data'
import { extractData, extractToken, handleError } from '../utils/request.handling'

interface TestResults {
  employer: {
    registration: InsertOneResult
    login: { logged_in: boolean }
    create: InsertOneResult
    created: Job
    update2: UpdateResult
    updated3: Negotiation
  }
  employee: {
    registration: InsertOneResult
    login: { logged_in: boolean }
    create: InsertOneResult
    update: UpdateResult
    delete: DeleteResult
    create2: InsertOneResult
    update2: UpdateResult
    delete2: DeleteResult
    update3: UpdateResult
  }
}

describe('Employee test', () => {
  const testResults: TestResults = {
    employee: {
      registration: undefined,
      login: undefined,
      create: undefined,
      update: undefined,
      delete: undefined,
      create2: undefined,
      update2: undefined,
      delete2: undefined,
      update3: undefined
    },
    employer: {
      registration: undefined,
      login: undefined,
      create: undefined,
      created: undefined,
      update2: undefined,
      updated3: undefined
    }
  }

  beforeAll(async () => {
    const employerClient: AxiosInstance = Axios.create({ baseURL: 'http://localhost:3000' })
    const employeeClient: AxiosInstance = Axios.create({ baseURL: 'http://localhost:3000' })

    /**
     * EMPLOYER register, login, create job
     */
    testResults.employer.registration = await employerClient.post('/auth/register', employer).then(extractData).catch(handleError)
    testResults.employer.login = await employerClient
      .post('/auth/login', employer)
      .then(extractToken(employerClient))
      .then(extractData)
      .catch(handleError)
    testResults.employer.create = await employerClient
      .post('/api/jobs', { ...job, employer: testResults.employer.registration.insertedId })
      .then(extractData)
      .catch(handleError)
    testResults.employer.created = await employerClient
      .get(`/api/jobs/${testResults.employer.create.insertedId}`)
      .then(extractData)
      .catch(handleError)

    /**
     * EMPLOYEE register, login
     * create job, update job, delete job
     * create negotiation, update negotiation
     */
    testResults.employee.registration = await employeeClient.post('/auth/register', employee).then(extractData).catch(handleError)
    testResults.employee.login = await employeeClient
      .post('/auth/login', employee)
      .then(extractToken(employeeClient))
      .then(extractData)
      .catch(handleError)
    testResults.employee.create = await employeeClient
      .post('/api/jobs', { ...job, employer: testResults.employee.registration.insertedId })
      .then(extractData)
      .catch(handleError)
    testResults.employee.update = await employeeClient
      .patch(`/api/jobs/${testResults.employer.create.insertedId}`, {
        description: 'updated description',
        requirements: 'updated requirements'
      })
      .then(extractData)
      .catch(handleError)
    testResults.employee.delete = await employeeClient
      .delete(`/api/jobs/${testResults.employer.create.insertedId}`)
      .then(extractData)
      .catch(handleError)
    testResults.employee.create2 = await employeeClient
      .post('/api/negotiations', {
        employee: testResults.employee.registration.insertedId,
        employer: testResults.employer.registration.insertedId,
        job: testResults.employer.create.insertedId
      })
      .then(extractData)
      .catch(handleError)
    testResults.employee.update2 = await employeeClient
      .patch(`/api/negotiations/${testResults.employee.create2.insertedId}`, { hasApplied: true })
      .then(extractData)
      .catch(handleError)
    /**
     * EMPLOYER invite
     */
    testResults.employer.update2 = await employerClient
      .patch(`/api/negotiations/${testResults.employee.create2.insertedId}`, {
        isInvited: true
      })
      .then(extractData)
      .catch(handleError)

    /**
     * EMPLOYEE accepts
     */
    testResults.employee.update3 = await employeeClient
      .patch(`/api/negotiations/${testResults.employee.create2.insertedId}`, {
        hasAccepted: true
      })
      .then(extractData)
      .catch(handleError)

    /**
     * EMPLOYEE result
     */
    testResults.employer.updated3 = await employerClient
      .get(`/api/negotiations/${testResults.employee.create2.insertedId}`)
      .then(extractData)
      .catch(handleError)
  })

  describe('TEST A - Employer', () => {
    test('TEST 01 - user registered  as Employer', async () => {
      expect(_pick(testResults.employer.registration, 'acknowledged')).toStrictEqual({ acknowledged: true })
    })

    test('TEST 02 - Employer logged in', async () => {
      expect(testResults.employer.login).toStrictEqual({ logged_in: true })
    })

    test('TEST 03 - Employer created Job', async () => {
      expect(_pick(testResults.employer.create, 'acknowledged')).toStrictEqual({ acknowledged: true })
      expect(_pick(testResults.employer.created, ['_id', 'name', 'description', 'requirements', 'employer'])).toStrictEqual({
        ...job,
        _id: testResults.employer.create.insertedId,
        employer: testResults.employer.registration.insertedId
      })
    })
  })

  describe('TEST B - Employee', () => {
    test('TEST 01 - user registered  as Employee', async () => {
      expect(_pick(testResults.employee.registration, 'acknowledged')).toStrictEqual({ acknowledged: true })
    })

    test('TEST 02 - Employee logged in', async () => {
      expect(testResults.employee.login).toStrictEqual({ logged_in: true })
    })

    test('TEST 03 - Employee created Job - failed', async () => {
      expect(testResults.employee.create).toStrictEqual({ message: 'access not allowed', name: '403' })
    })

    test('TEST 04 - Employee updated Job - failed', async () => {
      expect(testResults.employee.update).toStrictEqual({ message: 'access not allowed', name: '403' })
    })

    test('TEST 05 - Employee deleted Job - failed', async () => {
      expect(testResults.employee.delete).toStrictEqual({ message: 'access not allowed', name: '403' })
    })
  })

  describe('TEST C - Employee / Employer', () => {
    test('TEST 01 - Employee created Negotiation', async () => {
      expect(_pick(testResults.employee.create2, ['acknowledged'])).toStrictEqual({ acknowledged: true })
    })

    test('TEST 02 - Employee updated Negotiation', async () => {
      expect(_pick(testResults.employee.update2, ['acknowledged', 'modifiedCount'])).toStrictEqual({ acknowledged: true, modifiedCount: 1 })
    })

    test('TEST 03 - Employer updated Negotiation', async () => {
      expect(_pick(testResults.employer.update2, ['acknowledged', 'modifiedCount'])).toStrictEqual({ acknowledged: true, modifiedCount: 1 })
    })

    test('TEST 04 - Employee updated Negotiation', async () => {
      expect(_pick(testResults.employee.update3, ['acknowledged', 'modifiedCount'])).toStrictEqual({ acknowledged: true, modifiedCount: 1 })
    })

    test('TEST 05 - Employer gets Negotiation', async () => {
      expect(_pick(testResults.employer.updated3, ['hasAccepted', 'hasApplied', 'isInvited'])).toStrictEqual({
        hasAccepted: true,
        hasApplied: true,
        isInvited: true
      })
    })
  })
})
