import { useEffect, useState, useRef } from "react";
import { mockReports } from "../mockData";
import { EmergencyReport, ReportStatus } from "../types";
import KanbanColumn from "./KanbanColumn";
import "../styles/Dashboard.css";

export const Dashboard = () => {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    setReports(mockReports);

    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mouse tracking for glossy effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!dashboardRef.current) return;

      const cards = dashboardRef.current.querySelectorAll<HTMLElement>(
        ".report-card, .kanban-column"
      );

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to the card
        const x = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width)
        );
        const y = Math.max(
          0,
          Math.min(1, (e.clientY - rect.top) / rect.height)
        );

        // Set CSS variables for the position as percentage
        card.style.setProperty("--mouse-x", `${x * 100}%`);
        card.style.setProperty("--mouse-y", `${y * 100}%`);
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const reportedReports = reports.filter(
    (report) => report.status === ReportStatus.REPORTED
  );
  const inProgressReports = reports.filter(
    (report) => report.status === ReportStatus.IN_PROGRESS
  );
  const dispatchedReports = reports.filter(
    (report) => report.status === ReportStatus.DISPATCHED
  );
  const resolvedReports = reports.filter(
    (report) => report.status === ReportStatus.RESOLVED
  );

  return (
    <div className="dashboard" ref={dashboardRef}>
      <header className="dashboard-header">
        <div className="header-logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="logo-icon"
          >
            <path
              d="M12 2L4 7L12 12L20 7L12 2Z"
              fill="#4299E1"
              stroke="#63B3ED"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12L12 17L20 12"
              fill="#63B3ED"
              stroke="#4299E1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 17L12 22L20 17"
              fill="#90CDF4"
              stroke="#4299E1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="header-title">DroneWatch</h1>
        </div>
        <div className="header-info">
          <div className="info-box">
            <span className="info-label">Active Drones</span>
            <span className="info-value">42</span>
          </div>
          <div className="info-box">
            <span className="info-label">Current Time</span>
            <span className="info-value">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-heading">
          <div className="title-area">
            <h2 className="dashboard-title">Emergency Response Dashboard</h2>
            <p className="dashboard-subtitle">
              Real-time monitoring of emergency situations detected by
              autonomous drones
            </p>
          </div>
        </div>

        <div className="kanban-container">
          <KanbanColumn
            title={ReportStatus.REPORTED}
            reports={reportedReports}
            count={reportedReports.length}
          />
          <KanbanColumn
            title={ReportStatus.IN_PROGRESS}
            reports={inProgressReports}
            count={inProgressReports.length}
          />
          <KanbanColumn
            title={ReportStatus.DISPATCHED}
            reports={dispatchedReports}
            count={dispatchedReports.length}
          />
          <KanbanColumn
            title={ReportStatus.RESOLVED}
            reports={resolvedReports}
            count={resolvedReports.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
