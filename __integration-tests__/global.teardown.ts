import { execSync } from 'child_process'
import { Server } from 'http'
import { MongoClient } from 'mongodb'
import { Collections } from '../shared'

export default async (): Promise<void> => {
  const { server, mongoClient }: { server: Server; mongoClient: MongoClient } = global.state as {
    server: Server
    mongoClient: MongoClient
  }

  server.close()
  await mongoClient.db(process.env.MONGO_DB_DATABASE_NAME).collection(Collections.MONGO_DB_JOBS_COLLECTION_NAME).drop()
  await mongoClient.db(process.env.MONGO_DB_DATABASE_NAME).collection(Collections.MONGO_DB_NEGOTIATION_COLLECTION_NAME).drop()
  await mongoClient.db(process.env.MONGO_DB_DATABASE_NAME).collection(Collections.MONGO_DB_USER_COLLECTION_NAME).drop()
  mongoClient.close()

  execSync('docker-compose --project-name jobs -f .docker/docker-compose.yml down')
}
