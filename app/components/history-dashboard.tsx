"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { VisitRecord } from "@/lib/visits";

type LoadState = "locked" | "loading" | "ready" | "error";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function mapHref(visit: VisitRecord) {
  return `https://www.google.com/maps?q=${visit.latitude},${visit.longitude}`;
}

export function HistoryDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [state, setState] = useState<LoadState>("locked");
  const [error, setError] = useState("");

  const latestVisit = visits[0];

  const totalToday = useMemo(() => {
    const today = new Date().toDateString();
    return visits.filter(
      (visit) => new Date(visit.createdAt).toDateString() === today,
    ).length;
  }, [visits]);

  async function loadVisits(key = adminKey) {
    if (!key.trim()) {
      setState("locked");
      setError("Admin key enter karein.");
      return;
    }

    setState("loading");
    setError("");

    const response = await fetch("/api/visits", {
      headers: {
        "x-admin-key": key.trim(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      setState("error");
      setError(
        response.status === 401
          ? "Admin key galat hai."
          : "History load nahi ho paayi.",
      );
      return;
    }

    const data = (await response.json()) as { visits: VisitRecord[] };
    setVisits(data.visits);
    setState("ready");
    window.localStorage.setItem("visitor-location-admin-key", key.trim());
  }

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadVisits();
  }

  useEffect(() => {
    const storedKey = window.localStorage.getItem("visitor-location-admin-key");
    if (storedKey) {
      setAdminKey(storedKey);
      loadVisits(storedKey);
    }
  }, []);

  return (
    <div className="dashboard">
      <form className="adminBar" onSubmit={unlock}>
        <label className="fieldLabel" htmlFor="adminKey">
          Admin key
        </label>
        <input
          id="adminKey"
          className="textInput"
          onChange={(event) => setAdminKey(event.target.value)}
          placeholder="Enter key"
          type="password"
          value={adminKey}
        />
        <button className="primaryButton compact" type="submit">
          Unlock
        </button>
        <button
          className="secondaryButton compact"
          onClick={() => loadVisits()}
          type="button"
        >
          Refresh
        </button>
      </form>

      {error ? <p className="statusText error">{error}</p> : null}

      <div className="statsGrid">
        <div className="statBlock">
          <span>Total saved</span>
          <strong>{visits.length}</strong>
        </div>
        <div className="statBlock">
          <span>Today</span>
          <strong>{totalToday}</strong>
        </div>
        <div className="statBlock">
          <span>Latest</span>
          <strong>
            {latestVisit ? formatDate(latestVisit.createdAt) : "None"}
          </strong>
        </div>
      </div>

      <div className="tableWrap">
        {state === "loading" ? (
          <p className="emptyState">Loading history...</p>
        ) : null}

        {state !== "loading" && visits.length === 0 ? (
          <p className="emptyState">No shared yet.</p>
        ) : null}

        {visits.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Name</th>

                <th>Accuracy</th>
                <th>Device</th>
                <th>Map</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td data-label="Time">{formatDate(visit.createdAt)}</td>
                  <td data-label="Name">{visit.visitorName || "Not given"}</td>
                  {/* <td data-label="Location">
                    {visit.latitude}, {visit.longitude}
                    <span className="subText">{visit.timezone}</span>
                  </td> */}
                  <td data-label="Accuracy">{Math.round(visit.accuracy)} m</td>
                  <td data-label="Device">
                    {visit.language || "Unknown"}
                    <span className="subText">{visit.page}</span>
                  </td>
                  <td data-label="Map">
                    <a href={mapHref(visit)} rel="noreferrer" target="_blank">
                      Open
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
