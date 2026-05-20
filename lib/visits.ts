import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

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

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "visits.json");
const maxSavedVisits = 1000;

async function readStore(): Promise<VisitRecord[]> {
  try {
    const content = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
}

async function writeStore(visits: VisitRecord[]) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(visits, null, 2), "utf8");
}

export async function getVisits() {
  const visits = await readStore();
  return visits.sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function addVisit(input: NewVisit) {
  const currentVisits = await getVisits();
  const visit: VisitRecord = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await writeStore([visit, ...currentVisits].slice(0, maxSavedVisits));
  return visit;
}
