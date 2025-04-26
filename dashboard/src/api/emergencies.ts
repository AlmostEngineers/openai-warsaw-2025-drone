import { mockEmergencies } from "../mockData";
import { formatAddressFromApiData } from "../utils/formatters";

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
        reject(
          new Error(
            `Emergency with ID ${id} not found. Only IDs 1 and 2 are available in this demo.`
          )
        );
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

  try {
    // Use BigDataCloud API for reverse geocoding - doesn't require API key and works client-side
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    const data = await response.json();

    // Format the address using our utility function
    const address = formatAddressFromApiData(data);

    // Format coordinates nicely
    const coordsText = `${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° E`;

    if (address) {
      return {
        locationText: address,
        coordinatesText: coordsText,
      };
    }

    // If no address found, return coordinates as both
    return {
      locationText: coordsText,
      coordinatesText: "",
    };
  } catch (error) {
    console.error("Error fetching location name:", error);

    // Fallback if API fails
    const coordsText = `${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° E`;
    return {
      locationText: coordsText,
      coordinatesText: "",
    };
  }
};
