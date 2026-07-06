import { Search, Table2 } from "lucide-react";
import "../styles/dataPreview.css";

function DataPreview({
  rows,
  columns,
  searchText,
  onSearchChange,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) {
  const hasData = rows && rows.length > 0;

  return (
    <section className="data-preview-card card">
      <div className="data-preview-header">
        <div className="data-title-wrap">
          <div className="data-icon">
            <Table2 size={22} />
          </div>

          <div>
            <p className="eyebrow">Data Preview</p>
            <h2>Uploaded Rows</h2>
          </div>
        </div>

        <div className="table-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search rows..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {!hasData ? (
        <div className="table-empty">
          <Table2 size={42} />
          <h3>No rows to preview</h3>
          <p>Upload or select a dataset to view table data.</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.name}>{col.name}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col) => (
                      <td key={col.name}>
                        {row[col.name] !== undefined && row[col.name] !== null
                          ? String(row[col.name])
                          : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Page {currentPage} of {totalPages}
            </span>

            <div className="pagination-actions">
              <button onClick={onPrevPage} disabled={currentPage === 1}>
                Previous
              </button>

              <button
                onClick={onNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default DataPreview;