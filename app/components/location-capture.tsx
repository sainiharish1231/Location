"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { VisitRecord } from "@/lib/visits";

type CaptureState = "idle" | "locating" | "saving" | "saved" | "error";
type PermissionModalMode = "welcome" | "enableLocation";

function getGeoErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "not allowed.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return " unavailable.";
  }

  if (error.code === error.TIMEOUT) {
    return "Request timed out.";
  }

  return error.message || " capture nahi ho paayi.";
}

function roundCoord(value: number) {
  return Number(value.toFixed(6));
}

function formatVisitTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function LocationCapture() {
  const [visitorName, setVisitorName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modalMode, setModalMode] = useState<PermissionModalMode>("welcome");
  const [status, setStatus] = useState<CaptureState>("idle");
  const [error, setError] = useState("");
  const [savedVisit, setSavedVisit] = useState<VisitRecord | null>(null);
  const isLocationHelpModal = modalMode === "enableLocation";

  const buttonLabel = useMemo(() => {
    if (status === "locating") return "Getting ...";
    if (status === "saving") return "Saving...";
    if (status === "saved") return "Saved";
    if (isLocationHelpModal) return "retry";
    return "Allow & enter portfolio";
  }, [isLocationHelpModal, status]);

  useEffect(() => {
    if (!navigator.permissions?.query) return;

    let isMounted = true;
    let permissionStatus: PermissionStatus | null = null;

    function syncPermissionState() {
      if (!isMounted || !permissionStatus) return;

      if (permissionStatus.state === "denied") {
        setStatus("error");
        setError(" permission blocked hai. Browser settings me  allow karein.");
        setModalMode("enableLocation");
        setIsModalOpen(true);
        return;
      }

      if (permissionStatus.state === "granted") {
        setStatus((currentStatus) =>
          currentStatus === "error" ? "idle" : currentStatus,
        );
        setError("");
        setModalMode("welcome");
      }
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((nextPermissionStatus) => {
        if (!isMounted) return;

        permissionStatus = nextPermissionStatus;
        syncPermissionState();
        permissionStatus.addEventListener("change", syncPermissionState);
      })
      .catch(() => {
        // Some browsers do not support querying geolocation permission.
      });

    return () => {
      isMounted = false;
      permissionStatus?.removeEventListener("change", syncPermissionState);
    };
  }, []);

  function openPermissionModal() {
    setModalMode(status === "error" ? "enableLocation" : "welcome");
    setIsModalOpen(true);
  }

  function closePermissionModal() {
    setIsModalOpen(false);
  }

  async function savePosition(position: GeolocationPosition) {
    setStatus("saving");
    setError("");

    const payload = {
      consent: true,
      visitorName,
      latitude: roundCoord(position.coords.latitude),
      longitude: roundCoord(position.coords.longitude),
      accuracy: Math.round(position.coords.accuracy),
      altitude:
        typeof position.coords.altitude === "number"
          ? Math.round(position.coords.altitude)
          : null,
      heading:
        typeof position.coords.heading === "number"
          ? Math.round(position.coords.heading)
          : null,
      speed:
        typeof position.coords.speed === "number"
          ? Number(position.coords.speed.toFixed(2))
          : null,
      capturedAt: new Date(position.timestamp).toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      page: window.location.href,
    };

    const response = await fetch("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.error || " save nahi ho paayi.");
    }

    const data = (await response.json()) as { visit: VisitRecord };
    setSavedVisit(data.visit);
    setStatus("saved");
    closePermissionModal();
  }

  function requestLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!navigator.geolocation) {
      setStatus("error");
      setError("Is browser me  API supported nahi hai.");
      setModalMode("enableLocation");
      setIsModalOpen(true);
      return;
    }

    setStatus("locating");
    setError("");
    setModalMode(isLocationHelpModal ? "enableLocation" : "welcome");
    setSavedVisit(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        savePosition(position).catch((saveError: Error) => {
          setStatus("error");
          setError(saveError.message);
        });
      },
      (geoError) => {
        setStatus("error");
        setError(getGeoErrorMessage(geoError));
        setModalMode("enableLocation");
        setIsModalOpen(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }

  return (
    <>
      <div className="flex  hidden checkInCard">
        <div>
          <span className="miniLabel">Portfolio visitor</span>
          <strong>
            {savedVisit ? "Check-in saved" : "Quick visitor check-in"}
          </strong>
        </div>
        <button
          className="primaryButton compact"
          disabled={status === "locating" || status === "saving"}
          onClick={openPermissionModal}
          type="button"
        >
          {buttonLabel}
        </button>
        {savedVisit ? (
          <div className="visitorDataCard" aria-live="polite">
            <div className="visitorDataHeader">
              <span> saved</span>
              <strong>{formatVisitTime(savedVisit.createdAt)}</strong>
            </div>
            <div className="visitorDataGrid">
              <span>
                Latitude
                <strong>{savedVisit.latitude}</strong>
              </span>
              <span>
                Longitude
                <strong>{savedVisit.longitude}</strong>
              </span>
              <span>
                Accuracy
                <strong>{Math.round(savedVisit.accuracy)} m</strong>
              </span>
              <span>
                Timezone
                <strong>{savedVisit.timezone || "Unknown"}</strong>
              </span>
            </div>
            <a
              className="mapLink"
              href={`https://www.google.com/maps?q=${savedVisit.latitude},${savedVisit.longitude}`}
              rel="noreferrer"
              target="_blank"
            >
              Open on map
            </a>
          </div>
        ) : null}
        {status === "error" ? (
          <p className="statusText error">{error}</p>
        ) : null}
      </div>

      {isModalOpen ? (
        <div className="modalBackdrop" role="presentation">
          <form
            aria-labelledby="locationPermissionTitle"
            aria-modal="true"
            className={`permissionModal ${
              isLocationHelpModal ? "locationHelpModal" : ""
            }`}
            onSubmit={requestLocation}
            role="dialog"
          >
            <div className="modalCopy">
              <p className="eyebrow">
                {isLocationHelpModal ? " required" : "Portfolio check-in"}
              </p>
              <h2 id="locationPermissionTitle">
                {isLocationHelpModal
                  ? "Location on karein"
                  : "Welcome to Harish Portfolio"}
              </h2>
              <p>
                {isLocationHelpModal
                  ? " Portfolio enter karne ke liye browser/site settings me Location allow karein, phir retry karein."
                  : "Tap allow to enter the portfolio and show your live data on this page."}
              </p>
            </div>

            {isLocationHelpModal ? (
              <div
                className="locationHelpList"
                aria-label="Location enable steps"
              >
                <span>
                  1. Browser ke address bar me site settings open karein.
                </span>
              </div>
            ) : null}

            {status === "error" ? (
              <p className="statusText error">{error}</p>
            ) : null}

            <button
              className="primaryButton"
              disabled={status === "locating" || status === "saving"}
              type="submit"
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      ) : null}

      {/* {savedVisit ? (
        <div className="saveToast" aria-live="polite">
          <span>Location saved</span>
          <strong>
            {savedVisit.latitude}, {savedVisit.longitude}
          </strong>
        </div>
      ) : null} */}
    </>
  );
}
