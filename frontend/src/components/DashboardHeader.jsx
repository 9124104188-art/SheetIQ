import { LogOut } from "lucide-react";
import Button from "./Button";

function DashboardHeader({ user, onLogout }) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">Business Intelligence Workspace</p>
        <h1>Dashboard</h1>
      </div>

      <div className="header-actions">
        <div className="user-chip">
          <span>{user?.name?.charAt(0) || "U"}</span>

          <div>
            <strong>{user?.name || "User"}</strong>
            <small>{user?.email || "user@example.com"}</small>
          </div>
        </div>

        <Button
          variant="secondary"
          icon={<LogOut size={18} />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

export default DashboardHeader;