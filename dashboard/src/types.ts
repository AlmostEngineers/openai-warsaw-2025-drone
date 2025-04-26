export enum ReportStatus {
  REPORTED = "Reported",
  IN_PROGRESS = "In Progress",
  DISPATCHED = "Dispatched",
  RESOLVED = "Resolved",
}

export interface EmergencyReport {
  id: string;
  title: string;
  summary: string;
  location: string;
  timestamp: string;
  status: ReportStatus;
  imageUrl: string;
  severity: "low" | "medium" | "high" | "critical";
  droneId: string;
}
