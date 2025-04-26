import { mockEmergencies } from "../mockData";

// Define the interface matching the mockEmergencies data structure
export interface Emergency {
  id: string;
  type: string;
  status: string;
  timestamp: string;
  description: string;
  imageUrl?: string;
  location: {
    coordinates: number[]; // [longitude, latitude]
  };
}

/**
 * Get all emergencies
 */
export const getEmergencies = async (): Promise<Emergency[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmergencies);
    }, 500);
  });
};

/**
 * Get a single emergency by ID
 */
export const getEmergencyById = async (id: string): Promise<Emergency> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emergency = mockEmergencies.find((e: Emergency) => e.id === id);
      if (emergency) {
        resolve(emergency);
      } else {
        reject(new Error(`Emergency with ID ${id} not found`));
      }
    }, 500);
  });
};

/**
 * Update emergency status
 */
export const updateEmergencyStatus = async (
  id: string,
  status: string
): Promise<Emergency> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emergencyIndex = mockEmergencies.findIndex(
        (e: Emergency) => e.id === id
      );
      if (emergencyIndex >= 0) {
        const updatedEmergency = {
          ...mockEmergencies[emergencyIndex],
          status,
        };
        // In a real app, we would update the backend
        // For now, we just return the updated emergency
        resolve(updatedEmergency);
      } else {
        reject(new Error(`Emergency with ID ${id} not found`));
      }
    }, 500);
  });
};

/**
 * Get location name from coordinates
 * @param coordinates [longitude, latitude] array
 */
export const getLocationFromCoordinates = async (
  coordinates: number[]
): Promise<{ locationText: string; coordinatesText: string }> => {
  const [longitude, latitude] = coordinates;
  const coordsText = `(${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;

  try {
    // Try to use OpenStreetMap Nominatim API first
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "EmergencyDashboardApp/1.0",
        },
      }
    );

    const data = await response.json();

    if (data && data.address) {
      const addr = data.address;
      const parts = [];

      // Start with road/street and house number
      if (addr.road || addr.street || addr.pedestrian) {
        const street = addr.road || addr.street || addr.pedestrian;
        const houseNum = addr.house_number ? `${addr.house_number}` : "";

        if (houseNum) {
          parts.push(`${houseNum} ${street}`);
        } else {
          parts.push(street);
        }
      }

      // Then add neighborhood or suburb
      if (addr.neighbourhood || addr.suburb) {
        parts.push(addr.neighbourhood || addr.suburb);
      }

      // Then add city/town/village/etc
      if (addr.city || addr.town || addr.village || addr.municipality) {
        parts.push(addr.city || addr.town || addr.village || addr.municipality);
      }

      // Finally add country
      if (addr.country) {
        parts.push(addr.country);
      }

      if (parts.length > 0) {
        return {
          locationText: parts.join(", "),
          coordinatesText: coordsText,
        };
      }
    }

    // If OSM fails or returns incomplete data, use just the display_name
    if (data && data.display_name) {
      return {
        locationText: data.display_name,
        coordinatesText: coordsText,
      };
    }

    // If all else fails, return coordinates
    return {
      locationText: "Location at",
      coordinatesText: coordsText,
    };
  } catch (error) {
    console.error("Error fetching location name:", error);
    return {
      locationText: "Location at",
      coordinatesText: coordsText,
    };
  }
};
