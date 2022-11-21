import { DeleteResult, Document, Filter, InsertOneResult, UpdateResult, WithId } from 'mongodb'
import { Collections, Negotiation } from '../../shared'
import { getCollection } from './mongodb.adapter'

const collectionName: string = Collections.MONGO_DB_NEGOTIATION_COLLECTION_NAME

export const findAllNegotiation: (filter: Filter<Negotiation>) => Promise<Negotiation[]> = async (
  filter: Filter<Negotiation>
): Promise<Negotiation[]> => getCollection<Negotiation>(collectionName).find(filter).toArray()

export const findOneNegotiation: (filter: Filter<WithId<Negotiation>>) => Promise<Negotiation> = async (
  filter: Filter<WithId<Negotiation>>
): Promise<Negotiation> => getCollection<WithId<Negotiation>>(collectionName).findOne(filter)

export const createNegotiation: (negotiation: Negotiation) => Promise<InsertOneResult<Negotiation>> = async (
  negotiation: Negotiation
): Promise<InsertOneResult<Negotiation>> => {
  const updated: Date = new Date()
  const created: Date = updated

  return getCollection<Negotiation>(collectionName).insertOne({ ...negotiation, created, updated })
}

export const updateNegotiation: (filter: Filter<WithId<Negotiation>>, negotiation: Partial<Negotiation>) => Promise<UpdateResult> = async (
  filter: Filter<WithId<Negotiation>>,
  negotiation: Partial<Negotiation>
): Promise<UpdateResult> => getCollection<Negotiation>(collectionName).updateOne(filter, { $set: { ...negotiation, updated: new Date() } })

export const replaceNegotiation: (
  filter: Filter<WithId<Negotiation>>,
  negotiation: Negotiation
) => Promise<Document | UpdateResult> = async (
  filter: Filter<WithId<Negotiation>>,
  negotiation: Negotiation
): Promise<Document | UpdateResult> =>
  getCollection<Negotiation>(collectionName).replaceOne(filter, { ...negotiation, updated: new Date() })

export const deleteNegotiation: (filter: Filter<WithId<Negotiation>>) => Promise<DeleteResult> = async (
  filter: Filter<WithId<Negotiation>>
): Promise<DeleteResult> => getCollection<Negotiation>(collectionName).deleteOne(filter)
