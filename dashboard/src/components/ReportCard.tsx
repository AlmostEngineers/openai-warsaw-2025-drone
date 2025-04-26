import { EmergencyReport } from "../types";
import "../styles/ReportCard.css";

interface ReportCardProps {
  report: EmergencyReport;
}

const getSeverityClass = (severity: EmergencyReport["severity"]) => {
  switch (severity) {
    case "critical":
      return "severity-critical";
    case "high":
      return "severity-high";
    case "medium":
      return "severity-medium";
    case "low":
      return "severity-low";
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

export const ReportCard = ({ report }: ReportCardProps) => {
  return (
    <div className="report-card">
      <div className="report-image-container">
        <img
          src={report.imageUrl}
          alt={report.title}
          className="report-image"
        />
        <div className="image-overlay">
          <span className="drone-id">ID: {report.droneId}</span>
        </div>
      </div>

      <div className="report-content">
        <div className="report-header">
          <h3 className="report-title">{report.title}</h3>
          <span
            className={`severity-badge ${getSeverityClass(report.severity)}`}
          >
            <SeverityIcon severity={report.severity} />
            {report.severity.toUpperCase()}
          </span>
        </div>

        <div className="report-footer">
          <div className="report-metadata-group">
            <span className="report-metadata location">{report.location}</span>
            <span className="report-metadata date">
              {new Date(report.timestamp).toLocaleDateString()}{" "}
              {new Date(report.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
