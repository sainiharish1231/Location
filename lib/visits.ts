import { randomUUID } from "crypto";
import { MongoClient, type Collection } from "mongodb";

export type VisitRecord = {
  id: string;
  createdAt: string;
  capturedAt: string;
  visitorName: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timezone: string;
  language: string;
  page: string;
  userAgent: string;
};

export type NewVisit = Omit<VisitRecord, "id" | "createdAt">;

const maxSavedVisits = 1000;
const defaultDatabaseName = "visitor-location-web";
const defaultCollectionName = "visits";

type VisitDocument = VisitRecord & {
  _id?: unknown;
};

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

let visitsIndexesPromise: Promise<unknown> | null = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required to save visitor locations.");
  }

  return uri;
}

function getMongoClient() {
  globalForMongo.mongoClientPromise ??= new MongoClient(
    getMongoUri(),
  ).connect();

  return globalForMongo.mongoClientPromise;
}

async function getVisitsCollection(): Promise<Collection<VisitDocument>> {
  const client = await getMongoClient();
  const collection = client
    .db(process.env.MONGODB_DB || defaultDatabaseName)
    .collection<VisitDocument>(
      process.env.MONGODB_VISITS_COLLECTION || defaultCollectionName,
    );

  visitsIndexesPromise ??= Promise.all([
    collection.createIndex({ createdAt: -1 }),
    collection.createIndex({ id: 1 }, { unique: true }),
  ]);
  await visitsIndexesPromise;

  return collection;
}

function toVisitRecord({ _id, ...visit }: VisitDocument): VisitRecord {
  return visit;
}

async function trimOldVisits(collection: Collection<VisitDocument>) {
  const oldVisits = await collection
    .find({}, { projection: { id: 1 } })
    .sort({ createdAt: -1 })
    .skip(maxSavedVisits)
    .toArray();

  const oldIds = oldVisits
    .map((visit) => visit.id)
    .filter((id): id is string => typeof id === "string");

  if (oldIds.length > 0) {
    await collection.deleteMany({ id: { $in: oldIds } });
  }
}

export async function getVisits() {
  const collection = await getVisitsCollection();
  const visits = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(maxSavedVisits)
    .toArray();

  return visits.map(toVisitRecord);
}

export async function addVisit(input: NewVisit) {
  const collection = await getVisitsCollection();
  const visit: VisitRecord = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await collection.insertOne(visit);
  await trimOldVisits(collection);

  return visit;
}
