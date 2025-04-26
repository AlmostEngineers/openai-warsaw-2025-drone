import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import Layout from "./Layout";
import { EmergencyReport } from "../types";
import "../styles/EmergencyDetails.scss";
import "leaflet/dist/leaflet.css";
import * as db from "../../../db/mock-data.json";

// Custom Pulsing Dot component that adds a CSS class after mount
const PulsingDot = ({
  position,
  report,
}: {
  position: [number, number];
  report: EmergencyReport;
}) => {
  const [locationName, setLocationName] = useState<string>(
    "Loading location..."
  );
  const dotRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    // Fetch location name from coordinates using OpenStreetMap Nominatim API
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await response.json();
        if (data && data.display_name) {
          setLocationName(data.display_name);
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
        setLocationName(`${position[0]}, ${position[1]}`);
      }
    };

    fetchLocationName();
  }, [position]);

  return (
    <>
      <Circle
        center={position}
        radius={500}
        pathOptions={{
          color: "#4299E1",
          fillColor: "#4299E1",
          fillOpacity: 0.1,
          weight: 1,
        }}
      />
      <Circle
        center={position}
        radius={50}
        pathOptions={{
          color: "#4299E1",
          fillColor: "#4299E1",
          fillOpacity: 0.8,
          weight: 2,
          className: "pulsing-dot",
        }}
        ref={dotRef}
      >
        <Popup>
          <b>{report.title}</b>
          <br />
          {locationName}
        </Popup>
      </Circle>
    </>
  );
};

// Add map auto-zoom component
const MapBoundsUpdater = ({ position }: { position: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 14);
  }, [map, position]);

  return null;
};

const getSeverityClass = (severity: EmergencyReport["severity"]) => {
  switch (severity) {
    case "critical":
      return "report__severity--critical";
    case "high":
      return "report__severity--high";
    case "medium":
      return "report__severity--medium";
    case "low":
      return "report__severity--low";
    default:
      return "";
  }
};

const SeverityIcon = ({
  severity,
}: {
  severity: EmergencyReport["severity"];
}) => {
  switch (severity) {
    case "critical":
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "high":
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "medium":
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "low":
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

export const EmergencyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<EmergencyReport | null>(null);
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    // In a real app, this would be an API call
    const mockReports = db.reports as EmergencyReport[];
    const foundReport = mockReports.find((r) => r.id === id);
    setReport(foundReport || null);

    // When we have the report, fetch the location name
    if (foundReport) {
      fetchLocationName(
        foundReport.coordinates.lat,
        foundReport.coordinates.lng
      );
    }
  }, [id]);

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setLocationName(data.display_name);
      } else {
        setLocationName(`${lat}, ${lng}`);
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName(`${lat}, ${lng}`);
    }
  };

  if (!report) {
    return (
      <Layout>
        <div className="emergency-details__loading">
          <div className="emergency-details__loading-spinner"></div>
          <p>Loading emergency details...</p>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(report.timestamp).toLocaleDateString();
  const formattedTime = new Date(report.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Layout>
      <div className="emergency-details">
        <div className="emergency-details__header">
          <div className="emergency-details__header-content">
            <Link to="/" className="emergency-details__back-button">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Dashboard
            </Link>
            <h2 className="emergency-details__title">Emergency Details</h2>
          </div>
        </div>

        <div className="emergency-details__content">
          <div className="emergency-details__left">
            <div className="emergency-details__image-wrapper">
              <img
                src={report.imageUrl}
                alt={report.title}
                className="emergency-details__image"
              />
              <div className="emergency-details__image-overlay">
                <span className="emergency-details__drone-id">
                  Drone ID: {report.droneId}
                </span>
              </div>
            </div>

            <div className="emergency-details__map-container">
              <MapContainer
                center={[report.coordinates.lat, report.coordinates.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                className="emergency-details__map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <PulsingDot
                  position={[report.coordinates.lat, report.coordinates.lng]}
                  report={report}
                />
                <MapBoundsUpdater
                  position={[report.coordinates.lat, report.coordinates.lng]}
                />
              </MapContainer>
            </div>
          </div>

          <div className="emergency-details__right">
            <div className="emergency-details__info-card">
              <div className="emergency-details__info-header">
                <h3 className="emergency-details__info-title">
                  {report.title}
                </h3>
                <span
                  className={`emergency-details__severity ${getSeverityClass(
                    report.severity
                  )}`}
                >
                  <SeverityIcon severity={report.severity} />
                  {report.severity.toUpperCase()}
                </span>
              </div>

              <div className="emergency-details__info-section">
                <h4 className="emergency-details__info-section-title">
                  Description
                </h4>
                <p className="emergency-details__info-section-content">
                  {report.summary}
                </p>
              </div>

              <div className="emergency-details__info-grid">
                <div className="emergency-details__info-item">
                  <div className="emergency-details__info-item-label">
                    Status
                  </div>
                  <div className="emergency-details__info-item-value emergency-details__info-item-value--status">
                    {report.status}
                  </div>
                </div>

                <div className="emergency-details__info-item">
                  <div className="emergency-details__info-item-label">
                    Location
                  </div>
                  <div className="emergency-details__info-item-value">
                    {locationName ||
                      `${report.coordinates.lat}, ${report.coordinates.lng}`}
                  </div>
                </div>

                <div className="emergency-details__info-item">
                  <div className="emergency-details__info-item-label">
                    Reported On
                  </div>
                  <div className="emergency-details__info-item-value">
                    {formattedDate} at {formattedTime}
                  </div>
                </div>

                <div className="emergency-details__info-item">
                  <div className="emergency-details__info-item-label">
                    Severity
                  </div>
                  <div className="emergency-details__info-item-value">
                    {report.severity.charAt(0).toUpperCase() +
                      report.severity.slice(1)}
                  </div>
                </div>

                <div className="emergency-details__info-item">
                  <div className="emergency-details__info-item-label">
                    Drone ID
                  </div>
                  <div className="emergency-details__info-item-value">
                    {report.droneId}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyDetails;
