/**
 * Format a timestamp string into a human-readable date and time
 */
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  // Format options
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleDateString("en-US", options);
};

/**
 * Format coordinates to a readable string
 */
export const formatCoordinates = (coordinates: number[]): string => {
  // Extract latitude and longitude
  const [lat, lng] = coordinates;

  // Format latitude
  const latDirection = lat >= 0 ? "N" : "S";
  const latDegrees = Math.abs(lat).toFixed(4);

  // Format longitude
  const lngDirection = lng >= 0 ? "E" : "W";
  const lngDegrees = Math.abs(lng).toFixed(4);

  return `${latDegrees}° ${latDirection}, ${lngDegrees}° ${lngDirection}`;
};

/**
 * Format a severity level with proper capitalization
 */
export const formatSeverity = (severity: string): string => {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
};

/**
 * Format a distance in meters to a human-readable string
 */
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  } else {
    const distanceInKm = distanceInMeters / 1000;
    return `${distanceInKm.toFixed(1)} km`;
  }
};

/**
 * Format a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
};

/**
 * Interface representing BigDataCloud API response structure
 */
export interface GeocodingResponse {
  road?: string;
  streetNumber?: string;
  locality?: string;
  city?: string;
  principalSubdivision?: string;
  countryName?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Format address from BigDataCloud API response
 * Prioritizing street name and number, and avoiding redundancy
 */
export const formatAddressFromApiData = (data: any): string => {
  if (!data) return "";

  const parts: string[] = [];

  // ALWAYS prioritize street-level details if available
  if (data.road) {
    // Add street with number if available
    if (data.streetNumber) {
      parts.push(`${data.road} ${data.streetNumber}`);
    } else {
      parts.push(data.road);
    }
  }

  // Add locality if not redundant with road
  if (
    data.locality &&
    (!data.road || !data.road.includes(data.locality)) &&
    (!data.city || data.locality !== data.city)
  ) {
    parts.push(data.locality);
  }

  // Add city
  if (data.city) {
    parts.push(data.city);
  }

  // Add region if not redundant with city
  if (
    data.principalSubdivision &&
    (!data.city || data.principalSubdivision !== data.city)
  ) {
    parts.push(data.principalSubdivision);
  }

  // Add country
  if (data.countryName) {
    parts.push(data.countryName);
  }

  return parts.join(", ");
};
