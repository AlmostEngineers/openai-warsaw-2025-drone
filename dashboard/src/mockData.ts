import { EmergencyReport, ReportStatus } from "./types";

// Using reliable image sources
const ACCIDENT_IMAGE =
  "https://images.pexels.com/photos/200204/pexels-photo-200204.jpeg?auto=compress&cs=tinysrgb&w=600";
const FIRE_IMAGE =
  "https://images.pexels.com/photos/51951/fire-flame-firefighter-uniform-51951.jpeg?auto=compress&cs=tinysrgb&w=600";
const MEDICAL_IMAGE =
  "https://images.pexels.com/photos/9475868/pexels-photo-9475868.jpeg?auto=compress&cs=tinysrgb&w=600";
const FALLEN_TREE_IMAGE =
  "https://images.pexels.com/photos/1108813/pexels-photo-1108813.jpeg?auto=compress&cs=tinysrgb&w=600";
const CHEMICAL_SPILL_IMAGE =
  "https://images.pexels.com/photos/5996616/pexels-photo-5996616.jpeg?auto=compress&cs=tinysrgb&w=600";
const FLOOD_IMAGE =
  "https://images.pexels.com/photos/68230/pexels-photo-68230.jpeg?auto=compress&cs=tinysrgb&w=600";
const GAS_LEAK_IMAGE =
  "https://images.pexels.com/photos/5486847/pexels-photo-5486847.jpeg?auto=compress&cs=tinysrgb&w=600";

export const mockReports: EmergencyReport[] = [
  {
    id: "1",
    title: "Traffic Accident on Highway A4",
    summary:
      "Multiple vehicle collision detected on Highway A4, km 36. Two cars involved, one possibly overturned.",
    location: "51.1079° N, 17.0385° E",
    timestamp: "2025-06-12T08:43:21Z",
    status: ReportStatus.REPORTED,
    imageUrl: ACCIDENT_IMAGE,
    severity: "high",
    droneId: "DRN-492",
  },
  {
    id: "2",
    title: "Building Fire in Downtown Area",
    summary:
      "Smoke and flames detected on the 3rd floor of apartment building on Kościuszki Street. No visible casualties.",
    location: "51.1089° N, 17.0324° E",
    timestamp: "2025-06-12T09:12:05Z",
    status: ReportStatus.IN_PROGRESS,
    imageUrl: FIRE_IMAGE,
    severity: "critical",
    droneId: "DRN-238",
  },
  {
    id: "3",
    title: "Medical Emergency in City Park",
    summary:
      "Person collapsed near the central fountain in Słodowa Park. Possible cardiac event.",
    location: "51.1144° N, 17.0359° E",
    timestamp: "2025-06-12T10:25:17Z",
    status: ReportStatus.DISPATCHED,
    imageUrl: MEDICAL_IMAGE,
    severity: "high",
    droneId: "DRN-773",
  },
  {
    id: "4",
    title: "Fallen Tree Blocking Road",
    summary:
      "Large tree fallen across Powstańców Śląskich Street after storm. Two lanes blocked, no vehicles damaged.",
    location: "51.1003° N, 17.0338° E",
    timestamp: "2025-06-11T22:17:43Z",
    status: ReportStatus.RESOLVED,
    imageUrl: FALLEN_TREE_IMAGE,
    severity: "medium",
    droneId: "DRN-105",
  },
  {
    id: "5",
    title: "Chemical Spill Near Industrial Zone",
    summary:
      "Unknown substance leaking from tanker truck on Bierutowska Street. Creating vapor cloud, area needs evacuation.",
    location: "51.1273° N, 17.1064° E",
    timestamp: "2025-06-12T06:55:38Z",
    status: ReportStatus.IN_PROGRESS,
    imageUrl: CHEMICAL_SPILL_IMAGE,
    severity: "critical",
    droneId: "DRN-622",
  },
  {
    id: "6",
    title: "Water Main Break",
    summary:
      "Major flooding on Świdnicka Street due to broken water main. Water level rising, affecting local businesses.",
    location: "51.1062° N, 17.0333° E",
    timestamp: "2025-06-12T11:02:14Z",
    status: ReportStatus.REPORTED,
    imageUrl: FLOOD_IMAGE,
    severity: "medium",
    droneId: "DRN-309",
  },
  {
    id: "7",
    title: "Gas Leak in Residential Area",
    summary:
      "Strong gas odor detected near apartment complex on Grabiszyńska Street. Potential hazard.",
    location: "51.0997° N, 17.0174° E",
    timestamp: "2025-06-11T19:27:55Z",
    status: ReportStatus.RESOLVED,
    imageUrl: GAS_LEAK_IMAGE,
    severity: "high",
    droneId: "DRN-571",
  },
];
