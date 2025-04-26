import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  useMap,
  Marker,
} from "react-leaflet";
import { divIcon } from "leaflet";
import Layout from "./Layout";
import {
  Emergency,
  getEmergencyById,
  getLocationFromCoordinates,
} from "../api/emergencies";
import "../styles/EmergencyDetails.scss";
import "leaflet/dist/leaflet.css";

// Custom animated marker component
const AnimatedMarker = ({
  position,
  emergency,
}: {
  position: [number, number];
  emergency: Emergency;
}) => {
  const [locationName, setLocationName] = useState<string>(
    "Loading location..."
  );

  useEffect(() => {
    // Fetch location name from coordinates using OpenStreetMap Nominatim API
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "EmergencyDashboardApp/1.0",
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

  // Create a custom HTML-based icon for better animation support
  const customIcon = divIcon({
    className: "custom-marker-container",
    html: `
      <div class="animated-marker">
        <div class="marker-ripple"></div>
        <div class="marker-core"></div>
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

  return (
    <>
      {/* Range circle */}
      <Circle
        center={position}
        radius={500}
        pathOptions={{
          color: "#FF3A5E",
          fillColor: "#FF3A5E",
          fillOpacity: 0.05,
          weight: 1,
        }}
      />

      {/* Animated marker */}
      <Marker position={position} icon={customIcon}>
        <Popup>
          <b>{emergency.type}</b>
          <br />
          {locationName}
        </Popup>
      </Marker>
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

const getSeverityClass = (type: string) => {
  // Map emergency types to severity classes
  switch (type.toLowerCase()) {
    case "building fire":
    case "chemical spill":
      return "report__severity--critical";
    case "traffic accident":
    case "medical emergency":
    case "gas leak":
      return "report__severity--high";
    case "water main break":
    case "fallen tree":
      return "report__severity--medium";
    default:
      return "report__severity--medium";
  }
};

const SeverityIcon = ({ type }: { type: string }) => {
  // Map emergency types to severity levels for icons
  const severity =
    type.toLowerCase().includes("fire") ||
    type.toLowerCase().includes("chemical")
      ? "critical"
      : type.toLowerCase().includes("accident") ||
        type.toLowerCase().includes("medical") ||
        type.toLowerCase().includes("gas")
      ? "high"
      : "medium";

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
    default:
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
  }
};

const EmergencyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  const [locationData, setLocationData] = useState<{
    locationText: string;
    coordinatesText: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  useEffect(() => {
    const fetchEmergency = async () => {
      try {
        if (!id) return;
        const data = await getEmergencyById(id);
        setEmergency(data);

        // When we have the emergency, fetch the location name from coordinates
        if (data && data.location && data.location.coordinates) {
          fetchLocationName(data.location.coordinates);
        }
      } catch (error) {
        console.error("Error fetching emergency:", error);
      }
    };

    fetchEmergency();
  }, [id]);

  const fetchLocationName = async (coordinates: number[]) => {
    try {
      setIsLoadingLocation(true);
      const locationData = await getLocationFromCoordinates(coordinates);
      setLocationData(locationData);
    } catch (error) {
      console.error("Error fetching location name:", error);
      const [longitude, latitude] = coordinates;
      setLocationData({
        locationText: "Location at",
        coordinatesText: `(${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  if (!emergency) {
    return (
      <Layout>
        <div className="emergency-details__loading">
          <div className="emergency-details__loading-spinner"></div>
          <p>Loading emergency details...</p>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(emergency.timestamp).toLocaleDateString();
  const formattedTime = new Date(emergency.timestamp).toLocaleTimeString();

  // Extract coordinates in [lat, lng] format for the map
  const [longitude, latitude] = emergency.location.coordinates;
  const mapPosition: [number, number] = [latitude, longitude];

  return (
    <Layout>
      {showFullscreenImage && emergency.imageUrl && (
        <div
          className="emergency-details__fullscreen-overlay"
          onClick={() => setShowFullscreenImage(false)}
        >
          <div className="emergency-details__fullscreen-image-container">
            <img
              src={emergency.imageUrl}
              alt={emergency.type}
              className="emergency-details__fullscreen-image"
            />
            <button
              className="emergency-details__fullscreen-close"
              onClick={() => setShowFullscreenImage(false)}
              aria-label="Close fullscreen image"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
              {emergency.imageUrl ? (
                <img
                  src={emergency.imageUrl}
                  alt={emergency.type}
                  className="emergency-details__image"
                  onClick={() => setShowFullscreenImage(true)}
                />
              ) : (
                <div className="emergency-details__no-image">
                  <span>No image available</span>
                </div>
              )}
              <div className="emergency-details__image-overlay">
                <span className="emergency-details__drone-id">
                  Emergency ID: {emergency.id}
                </span>
                {emergency.imageUrl && (
                  <button
                    className="emergency-details__fullscreen-btn"
                    onClick={() => setShowFullscreenImage(true)}
                    aria-label="View image fullscreen"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 11V3h8M21 3v8m0 4v6h-8M3 13v8h8m0-16L3 11m10 0l8-8M3 13l8 8m2 0l8-8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="emergency-details__map-container">
              <MapContainer
                center={mapPosition}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                className="emergency-details__map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <AnimatedMarker position={mapPosition} emergency={emergency} />
                <MapBoundsUpdater position={mapPosition} />
              </MapContainer>
            </div>
          </div>

          <div className="emergency-details__right">
            <div className="emergency-details__info-card">
              <div className="emergency-details__info-header">
                <h3 className="emergency-details__info-title">
                  {emergency.type}
                </h3>
                <span
                  className={`emergency-details__severity ${getSeverityClass(
                    emergency.type
                  )}`}
                >
                  <SeverityIcon type={emergency.type} />
                  {getSeverityFromType(emergency.type).toUpperCase()}
                </span>
              </div>

              <div className="emergency-details__info-section">
                <h4 className="emergency-details__info-section-title">
                  Description
                </h4>
                <p className="emergency-details__info-section-content">
                  {emergency.description}
                </p>
              </div>

              <div className="emergency-details__info-grid">
                <div className="emergency-details__info-item">
                  <div className="emergency-details__info-item-label">
                    Status
                  </div>
                  <div className="emergency-details__info-item-value emergency-details__info-item-value--status">
                    {emergency.status}
                  </div>
                </div>

                <div className="emergency-details__info-item">
                  <div className="emergency-details__info-item-label">
                    Location
                  </div>
                  <div className="emergency-details__info-item-value">
                    {isLoadingLocation ? (
                      <div className="location-loader">
                        <div className="location-loader__spinner"></div>
                        <span>Fetching location...</span>
                      </div>
                    ) : (
                      locationData && (
                        <>
                          <span className="emergency-details__location-text">
                            {locationData.locationText}
                          </span>{" "}
                          <span className="emergency-details__coordinates-text">
                            {locationData.coordinatesText}
                          </span>
                        </>
                      )
                    )}
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
                    {getSeverityFromType(emergency.type)
                      .charAt(0)
                      .toUpperCase() +
                      getSeverityFromType(emergency.type).slice(1)}
                  </div>
                </div>

                <div className="emergency-details__info-item">
                  <div className="emergency-details__info-item-label">
                    Emergency ID
                  </div>
                  <div className="emergency-details__info-item-value">
                    {emergency.id}
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

// Helper function to determine severity from emergency type
const getSeverityFromType = (type: string): string => {
  if (
    type.toLowerCase().includes("fire") ||
    type.toLowerCase().includes("chemical")
  ) {
    return "critical";
  } else if (
    type.toLowerCase().includes("accident") ||
    type.toLowerCase().includes("medical") ||
    type.toLowerCase().includes("gas")
  ) {
    return "high";
  } else {
    return "medium";
  }
};

export default EmergencyDetails;
