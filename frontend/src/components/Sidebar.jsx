import {
  FaChartLine,
  FaHome,
  FaDatabase,
  FaQuestionCircle,
} from "react-icons/fa";

import "../styles/dashboard.css";

function Sidebar({ datasetCount = 0 }) {
  const maxDatasets = 5;
  const progressWidth = `${(datasetCount / maxDatasets) * 100}%`;

  return (
    <aside className="sidebar">
      {/* Top */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <FaChartLine />
          </div>

          <div>
            <h2>DataPilot</h2>
            <span>AI Analytics</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a className="active">
            <FaHome />
            <span>Dashboard</span>
          </a>

          <a>
            <FaDatabase />
            <span>Datasets</span>
          </a>
        </nav>
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-plan">
          <p>Storage</p>

          <strong>
            {datasetCount} / {maxDatasets} Datasets
          </strong>

          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: progressWidth }}
            />
          </div>

          <small className="plan-text">
            Free Plan
          </small>
        </div>

        <div className="version-card">
          <small>Version</small>

          <strong>v1.0</strong>

          <span>Powered by AI</span>
        </div>

        <div className="help-box">
          <FaQuestionCircle />
          <span>Help & Support</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;