import { DeleteResult, Document, Filter, InsertOneResult, UpdateResult, WithId } from 'mongodb'
import { Collections, Job } from '../../shared'
import { getCollection } from './mongodb.adapter'

const collectionName: string = Collections.MONGO_DB_JOBS_COLLECTION_NAME

export const findAllJob: (filter: Filter<Job>) => Promise<Job[]> = async (filter: Filter<Job>): Promise<Job[]> =>
  getCollection<Job>(collectionName).find(filter).toArray()

export const findOneJob: (filter: Filter<WithId<Job>>) => Promise<Job> = async (filter: Filter<WithId<Job>>): Promise<Job> =>
  getCollection<WithId<Job>>(collectionName).findOne(filter)

export const createJob: (job: Job) => Promise<InsertOneResult<Job>> = async (job: Job): Promise<InsertOneResult<Job>> => {
  const updated: Date = new Date()
  const created: Date = updated

  return getCollection<Job>(collectionName).insertOne({ ...job, created, updated })
}

export const updateJob: (filter: Filter<WithId<Job>>, job: Partial<Job>) => Promise<UpdateResult> = async (
  filter: Filter<WithId<Job>>,
  job: Partial<Job>
): Promise<UpdateResult> => getCollection<Job>(collectionName).updateOne(filter, { $set: { ...job, updated: new Date() } })

export const replaceJob: (filter: Filter<WithId<Job>>, job: Job) => Promise<Document | UpdateResult> = async (
  filter: Filter<WithId<Job>>,
  job: Job
): Promise<Document | UpdateResult> => getCollection<Job>(collectionName).replaceOne(filter, { ...job, updated: new Date() })

export const deleteJob: (filter: Filter<WithId<Job>>) => Promise<DeleteResult> = async (
  filter: Filter<WithId<Job>>
): Promise<DeleteResult> => getCollection<Job>(collectionName).deleteOne(filter)
