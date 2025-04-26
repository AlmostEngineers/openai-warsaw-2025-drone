import { EmergencyReport, ReportStatus } from "./types";
import accident1Image from "./assets/accident1.png";
import accident2Image from "./assets/accident2.png";

// Using local images from assets folder
const ACCIDENT1_IMAGE = accident1Image;
const ACCIDENT2_IMAGE = accident2Image;

export const mockReports: EmergencyReport[] = [
  {
    id: "1",
    title: "Car Accident at Intersection",
    summary:
      "Two vehicles involved in a collision at Main Street intersection. Minor injuries reported.",
    coordinates: {
      lat: 52.2297,
      lng: 21.0122,
    },
    timestamp: "2025-06-11T15:43:21Z",
    status: ReportStatus.RESOLVED,
    imageUrl: ACCIDENT1_IMAGE,
    severity: "medium",
    droneId: "DRN-492",
  },
  {
    id: "2",
    title: "Vehicle Fire After Collision",
    summary:
      "Serious accident with one car overturned and on fire. Multiple casualties reported, immediate assistance required.",
    coordinates: {
      lat: 52.4064,
      lng: 16.9252,
    },
    timestamp: "2025-06-12T09:12:05Z",
    status: ReportStatus.REPORTED,
    imageUrl: ACCIDENT2_IMAGE,
    severity: "critical",
    droneId: "DRN-238",
  },
];

// Mock emergencies data that matches the Emergency interface in emergencies.ts
export const mockEmergencies = [
  {
    id: "1",
    type: "Car Accident",
    status: "Resolved",
    timestamp: "2025-06-11T15:43:21Z",
    description:
      "Two vehicles involved in a collision at Main Street intersection. Minor injuries reported.",
    imageUrl: ACCIDENT1_IMAGE,
    location: {
      coordinates: [21.0122, 52.2297], // [longitude, latitude]
    },
  },
  {
    id: "2",
    type: "Vehicle Fire",
    status: "Reported",
    timestamp: "2025-06-12T09:12:05Z",
    description:
      "Serious accident with one car overturned and on fire. Multiple casualties reported, immediate assistance required.",
    imageUrl: ACCIDENT2_IMAGE,
    location: {
      coordinates: [16.9252, 52.4064], // [longitude, latitude]
    },
  },
];
