import { useEffect, useState, useRef } from "react";
import { mockReports } from "../mockData";
import { EmergencyReport, ReportStatus } from "../types";
import KanbanColumn from "./KanbanColumn";
import Layout from "./Layout";
import "../styles/Dashboard.scss";

export const Dashboard = () => {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    setReports(mockReports);

    // Mouse tracking for glossy effect
    const handleMouseMove = (e: MouseEvent) => {
      // Get the element directly under the mouse pointer
      const targetElement = e.target as HTMLElement;

      // Find the closest report-card or kanban-column parent element if the target itself isn't one
      const closestCard = targetElement.closest<HTMLElement>(
        ".report__card, .kanban__column"
      );

      // Only update the CSS variables if we found a relevant element
      if (closestCard) {
        const rect = closestCard.getBoundingClientRect();

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
        closestCard.style.setProperty("--mouse-x", `${x * 100}%`);
        closestCard.style.setProperty("--mouse-y", `${y * 100}%`);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
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
    <Layout>
      <div className="dashboard__heading">
        <div className="dashboard__title-area">
          <h2 className="dashboard__title">Emergency Response Dashboard</h2>
          <p className="dashboard__subtitle">
            Real-time monitoring of emergency situations detected by autonomous
            drones
          </p>
        </div>
      </div>

      <div className="dashboard__kanban-container" ref={dashboardRef}>
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
    </Layout>
  );
};

export default Dashboard;
