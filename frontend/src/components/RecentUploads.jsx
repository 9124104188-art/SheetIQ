import { Trash2 } from "lucide-react";
import Button from "./Button";
function RecentUploads({ datasets, onSelect, onDelete }) {
  return (
    <section className="card recent-card">
      <p className="eyebrow">Recent Uploads</p>
      <h2>Dataset History</h2>

      {datasets.length === 0 ? (
        <p className="empty-text">No datasets uploaded yet.</p>
      ) : (
        datasets.map((dataset) => (
          <div className="recent-item" key={dataset._id}>
            <div>
              <strong>{dataset.name}</strong>
              <span>
                {dataset.reportType} • {dataset.rowCount} rows
              </span>
            </div>

            <div className="recent-actions">
              <button onClick={() => onSelect(dataset._id)}>View</button>
              <Button
  variant="danger"
  icon={<Trash2 size={16} />}
  onClick={() => onDelete(dataset._id)}
>
  Delete
</Button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default RecentUploads;