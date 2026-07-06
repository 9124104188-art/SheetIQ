import ReactMarkdown from "react-markdown";
import { FaRobot } from "react-icons/fa";

function AISummaryCard({
  dataset,
  generating,
  onGenerateSummary,
}) {
  return (
    <section className="card ai-card">
      <div className="ai-header">
        <div className="ai-title">
          <div className="ai-icon">
            <FaRobot />
          </div>

          <div>
            <p className="eyebrow">AI INSIGHTS</p>
            <h2>Business Report</h2>
          </div>
        </div>

        <button
          className="secondary-btn"
          disabled={!dataset || generating}
          onClick={() =>
            onGenerateSummary(dataset._id)
          }
        >
          {dataset?.aiSummary
            ? "Regenerate"
            : "Generate"}
        </button>
      </div>

      {!dataset ? (
        <p className="empty-text">
          Upload a dataset first.
        </p>
      ) : dataset.aiSummary ? (
        <div className="markdown-body">
          <ReactMarkdown>
            {dataset.aiSummary}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="empty-text">
          No AI summary generated yet.
        </p>
      )}
    </section>
  );
}

export default AISummaryCard;