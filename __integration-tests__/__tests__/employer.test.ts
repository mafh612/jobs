import _pick from 'lodash.pick'
import Axios, { AxiosInstance } from 'axios'
import { Job } from '../../shared'
import { DeleteResult, InsertOneResult, UpdateResult } from 'mongodb'
import { employer, job2 as job } from '../__mocks__/data'
import { extractData, extractToken, handleError } from '../utils/request.handling'

interface TestResults {
  registration: InsertOneResult
  login: { logged_in: boolean }
  create: InsertOneResult
  created: Job
  update: UpdateResult
  updated: Job
  delete: DeleteResult
}

describe('Employer test', () => {
  const testResults: TestResults = {
    registration: undefined,
    login: undefined,
    create: undefined,
    created: undefined,
    update: undefined,
    updated: undefined,
    delete: undefined
  }

  beforeAll(async () => {
    const client: AxiosInstance = Axios.create({ baseURL: 'http://localhost:3000' })

    testResults.registration = await client.post('/auth/register', employer).then(extractData).catch(handleError)
    testResults.login = await client.post('/auth/login', employer).then(extractToken(client)).then(extractData)
    testResults.create = await client.post('/api/jobs', { ...job, employer: testResults.registration.insertedId }).then(extractData)
    testResults.created = await client.get(`/api/jobs/${testResults.create.insertedId}`).then(extractData)
    testResults.update = await client
      .patch(`/api/jobs/${testResults.create.insertedId}`, {
        description: 'updated description',
        requirements: 'updated requirements'
      })
      .then(extractData)
    testResults.updated = await client.get(`/api/jobs/${testResults.create.insertedId}`).then(extractData)
    testResults.delete = await client.delete(`/api/jobs/${testResults.create.insertedId}`).then(extractData)
  })

  test('TEST 01 - user registered  as Employer', async () => {
    expect(_pick(testResults.registration, 'acknowledged')).toStrictEqual({ acknowledged: true })
  })

  test('TEST 02 - Employer logged in', async () => {
    expect(testResults.login).toStrictEqual({ logged_in: true })
  })

  test('TEST 03 - Employer created Job', async () => {
    expect(_pick(testResults.create, 'acknowledged')).toStrictEqual({ acknowledged: true })
    expect(_pick(testResults.created, ['_id', 'name', 'description', 'requirements', 'employer'])).toStrictEqual({
      ...job,
      _id: testResults.create.insertedId,
      employer: testResults.registration.insertedId
    })
  })

  test('TEST 04 - Employer updated Job', async () => {
    expect(_pick(testResults.update, 'acknowledged')).toStrictEqual({ acknowledged: true })
    expect(_pick(testResults.updated, ['_id', 'name', 'description', 'requirements', 'employer'])).toStrictEqual({
      ...job,
      _id: testResults.create.insertedId,
      employer: testResults.registration.insertedId,
      description: 'updated description',
      requirements: 'updated requirements'
    })
  })

  test('TEST 05 - Employer deleted Job', async () => {
    expect(testResults.delete).toStrictEqual({ acknowledged: true, deletedCount: 1 })
  })
})
