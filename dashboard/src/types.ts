export enum ReportStatus {
  REPORTED = "REPORTED",
  IN_PROGRESS = "IN_PROGRESS",
  DISPATCHED = "DISPATCHED",
  RESOLVED = "RESOLVED",
}

export interface EmergencyReport {
  id: string;
  title: string;
  summary: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  status: ReportStatus;
  imageUrl: string;
  severity: "low" | "medium" | "high" | "critical";
  droneId: string;
}
