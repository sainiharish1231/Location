import { NextRequest, NextResponse } from "next/server";
import { addVisit, getVisits } from "@/lib/visits";

export const dynamic = "force-dynamic";

const fallbackAdminKey = "change-me-local";

function getAdminKey() {
  return process.env.ADMIN_KEY || fallbackAdminKey;
}

function isAdminRequest(request: NextRequest) {
  const providedKey =
    request.headers.get("x-admin-key") ||
    request.nextUrl.searchParams.get("key") ||
    "";

  return providedKey === getAdminKey();
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function cleanNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isValidCoordinate(latitude: number | null, longitude: number | null) {
  return (
    latitude !== null &&
    longitude !== null &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const visits = await getVisits();
  return NextResponse.json({ visits });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || body.consent !== true) {
    return NextResponse.json(
      { error: " consent is required." },
      { status: 400 },
    );
  }

  const latitude = cleanNumber(body.latitude);
  const longitude = cleanNumber(body.longitude);

  if (
    latitude === null ||
    longitude === null ||
    !isValidCoordinate(latitude, longitude)
  ) {
    return NextResponse.json(
      { error: "Valid latitude and longitude are required." },
      { status: 400 },
    );
  }

  const visit = await addVisit({
    accuracy: cleanNumber(body.accuracy) ?? 0,
    altitude: cleanNumber(body.altitude),
    capturedAt: cleanString(body.capturedAt, 40),
    heading: cleanNumber(body.heading),
    language: cleanString(body.language, 40),
    latitude,
    longitude,
    page: cleanString(body.page, 240),
    speed: cleanNumber(body.speed),
    timezone: cleanString(body.timezone, 80),
    userAgent: cleanString(request.headers.get("user-agent"), 240),
    visitorName: cleanString(body.visitorName, 80),
  });

  return NextResponse.json({ visit }, { status: 201 });
}
