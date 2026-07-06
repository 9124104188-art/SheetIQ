import {
  FaChartLine,
  FaHome,
  FaDatabase,
  FaChartBar,
  FaRobot,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";

import "../styles/dashboard.css";

function Sidebar({ datasetCount = 2 }) {
  const progressWidth = `${(datasetCount / 5) * 100}%`;

  return (
    <aside className="sidebar">
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
            Dashboard
          </a>

          <a>
            <FaDatabase />
            Datasets
          </a>

          <a>
            <FaChartBar />
            Reports
            <span className="coming-soon">Soon</span>
          </a>

          <a>
            <FaRobot />
            AI Insights
            <span className="coming-soon">Soon</span>
          </a>

          <a>
            <FaCog />
            Settings
          </a>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-plan">
          <p>Free Tier</p>

          <strong>{datasetCount} / 5 datasets used</strong>

          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: progressWidth }}
            />
          </div>
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