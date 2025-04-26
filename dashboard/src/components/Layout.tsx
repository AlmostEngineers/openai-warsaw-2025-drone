import { ReactNode, useEffect, useState } from "react";
import "../styles/Dashboard.scss";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="dashboard__logo-icon"
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
          <h1 className="dashboard__logo-title">DroneWatch</h1>
        </div>
        <div className="dashboard__info">
          <div className="dashboard__info-box">
            <span className="dashboard__info-box-label">Active Drones</span>
            <span className="dashboard__info-box-value">1</span>
          </div>
          <div className="dashboard__info-box">
            <span className="dashboard__info-box-label">Current Time</span>
            <span className="dashboard__info-box-value">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
          <div className="dashboard__status-badge">
            <div className="dashboard__status-badge-dot"></div>
            <span className="dashboard__status-badge-label">SYSTEM STATUS</span>
            <strong className="dashboard__status-badge-value">Online</strong>
          </div>
        </div>
      </header>

      <div className="dashboard__content">{children}</div>
    </div>
  );
};

export default Layout;
