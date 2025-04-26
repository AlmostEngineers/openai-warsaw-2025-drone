import { EmergencyReport, ReportStatus } from "../types";
import ReportCard from "./ReportCard";
import "../styles/KanbanColumn.scss";

interface KanbanColumnProps {
  title: ReportStatus;
  reports: EmergencyReport[];
  count: number;
}

const getColumnColor = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.REPORTED:
      return "kanban__column--reported";
    case ReportStatus.IN_PROGRESS:
      return "kanban__column--in-progress";
    case ReportStatus.DISPATCHED:
      return "kanban__column--dispatched";
    case ReportStatus.RESOLVED:
      return "kanban__column--resolved";
    default:
      return "";
  }
};

const StatusIcon = ({ status }: { status: ReportStatus }) => {
  switch (status) {
    case ReportStatus.REPORTED:
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8V12L15 15"
            stroke="#FC8181"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" stroke="#FC8181" strokeWidth="2" />
        </svg>
      );
    case ReportStatus.IN_PROGRESS:
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6V12L16 14"
            stroke="#F6AD55"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" stroke="#F6AD55" strokeWidth="2" />
        </svg>
      );
    case ReportStatus.DISPATCHED:
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13L9 17L19 7"
            stroke="#63B3ED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case ReportStatus.RESOLVED:
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13L9 17L19 7"
            stroke="#68D391"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
            stroke="#68D391"
            strokeWidth="2"
          />
        </svg>
      );
    default:
      return null;
  }
};

export const KanbanColumn = ({ title, reports, count }: KanbanColumnProps) => {
  return (
    <div className={`kanban__column ${getColumnColor(title)}`}>
      <div className="kanban__header">
        <h2 className="kanban__title">
          <StatusIcon status={title} />
          <span>{title}</span>
        </h2>
        <span className="kanban__badge">
          {count} {count === 1 ? "report" : "reports"}
        </span>
      </div>

      <div className="kanban__content">
        {reports.length === 0 ? (
          <div className="kanban__empty-message">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                stroke="#A0AEC0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>No reports in this category</p>
          </div>
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
