import "../styles/skeleton.css";

function DashboardSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div>
          <div className="skeleton-line small"></div>
          <div className="skeleton-line title"></div>
        </div>

        <div className="skeleton-user"></div>
      </div>

      <div className="skeleton-upload"></div>

      <div className="skeleton-kpi-grid">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>

      <div className="skeleton-main-grid">
        <div className="skeleton-large-card"></div>
        <div className="skeleton-large-card"></div>
      </div>

      <div className="skeleton-main-grid">
        <div className="skeleton-table"></div>
        <div className="skeleton-large-card"></div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;