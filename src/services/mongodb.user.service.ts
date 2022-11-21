import { DeleteResult, Document, Filter, InsertOneResult, UpdateResult, WithId } from 'mongodb'
import { Collections, User } from '../../shared'
import { getCollection } from './mongodb.adapter'

const collectionName: string = Collections.MONGO_DB_USER_COLLECTION_NAME

export const findAllUser: (filter: Filter<User>) => Promise<User[]> = async (filter: Filter<User>): Promise<User[]> =>
  getCollection<User>(collectionName)
    .find(filter, { projection: { password: 0 } })
    .toArray()

export const findOneUser: (filter: Filter<WithId<User>>, password?: boolean) => Promise<WithId<User>> = async (
  filter: Filter<WithId<User>>,
  password: boolean = false
): Promise<WithId<User>> =>
  getCollection<WithId<User>>(collectionName).findOne(
    filter,
    password ? { projection: { password, role: 1, email: 1 } } : { projection: { password: 0 } }
  )

export const createUser: (user: User) => Promise<InsertOneResult<User>> = async (user: User): Promise<InsertOneResult<User>> => {
  const updated: Date = new Date()
  const created: Date = updated

  return getCollection<User>(collectionName).insertOne({ ...user, created, updated })
}

export const updateUser: (filter: Filter<WithId<User>>, user: Partial<User>) => Promise<UpdateResult> = async (
  filter: Filter<WithId<User>>,
  user: Partial<User>
): Promise<UpdateResult> => getCollection<User>(collectionName).updateOne(filter, { $set: { ...user, updated: new Date() } })

export const replaceUser: (filter: Filter<WithId<User>>, user: User) => Promise<Document | UpdateResult> = async (
  filter: Filter<WithId<User>>,
  user: User
): Promise<Document | UpdateResult> => getCollection<User>(collectionName).replaceOne(filter, { ...user, updated: new Date() })

export const deleteUser: (filter: Filter<WithId<User>>) => Promise<DeleteResult> = async (
  filter: Filter<WithId<User>>
): Promise<DeleteResult> => getCollection<User>(collectionName).deleteOne(filter)
