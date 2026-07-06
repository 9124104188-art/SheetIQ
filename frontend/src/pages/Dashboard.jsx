import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useDatasets from "../hooks/useDatasets";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import UploadPanel from "../components/UploadPanel";
import KPICard from "../components/KPICard";
import ChartPanel from "../components/ChartPanel";
import DataPreview from "../components/DataPreview";
import AISummaryCard from "../components/AISummaryCard";
import RecentUploads from "../components/RecentUploads";
import { Download } from "lucide-react";
import Button from "../components/Button";
import DashboardSkeleton from "../components/DashboardSkeleton";

import "../styles/dashboard.css";

import {
  getFilteredRows,
  getPaginatedRows,
  getChartData,
} from "../utils/dashboardHelpers";

import {
  FaDatabase,
  FaColumns,
  FaTags,
  FaFolderOpen,
} from "react-icons/fa";

function Dashboard() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

 const {
  datasets,
  selectedDataset,
  uploading,
  error,
  loadingDatasets,
  fetchDatasetById,
  handleUpload,
  handleDeleteDataset,
  generatingSummary,
  handleGenerateSummary,
  handleExportCSV,
} = useDatasets();

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const rowsPerPage = 5;

  const allRows = selectedDataset?.rows || [];
  const allColumns = selectedDataset?.columns || [];

  const filteredRows = getFilteredRows(allRows, searchText);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = getPaginatedRows(
    filteredRows,
    currentPage,
    rowsPerPage
  );

  const { chartData, chartLabelKey, chartValueKey } = getChartData(
    allRows,
    allColumns
  );

  const handleSearchChange = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
  <div className="dashboard-shell">
    <Sidebar datasetCount={datasets.length} />

    <main className="dashboard-main">
      <DashboardHeader user={user} onLogout={handleLogout} />

      {loadingDatasets ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section className="top-workspace-grid">
            <UploadPanel onUpload={handleUpload} uploading={uploading} />

           <div className="quick-actions card">
  <div>
    <p className="eyebrow">Quick Actions</p>
    <h2>Dataset Tools</h2>
  </div>

  <div className="selected-dataset-box">
    <p>Selected Dataset</p>

    <strong>
      {selectedDataset?.name || "No dataset selected"}
    </strong>

    <span>
      {selectedDataset
        ? `${selectedDataset.rowCount} rows • ${selectedDataset.columnCount} columns`
        : "Upload or select a dataset"}
    </span>
  </div>

  <Button
    variant="secondary"
    icon={<Download size={18} />}
    disabled={!selectedDataset}
    onClick={() =>
      handleExportCSV(selectedDataset._id, selectedDataset.name)
    }
  >
    Export CSV
  </Button>

  <div className="quick-info">
    <div>
      <small>Report Type</small>
      <strong>{selectedDataset?.reportType || "-"}</strong>
    </div>

    <div>
      <small>Status</small>
      <strong>
        {selectedDataset ? "Ready" : "Waiting"}
      </strong>
    </div>
  </div>

  <p className="quick-help">
    Download the selected dataset as a CSV file.
  </p>
</div>

          </section>

          {error && <div className="dashboard-error">{error}</div>}

          <section className="kpi-grid">

<KPICard
title="Total Rows"
value={selectedDataset?.rowCount || 0}
subtitle="Ready to analyze"
icon={<FaDatabase />}
color="#8b5cf6"
/>

<KPICard
title="Columns"
value={selectedDataset?.columnCount || 0}
subtitle="Auto detected"
icon={<FaColumns />}
color="#2563eb"
/>

<KPICard
title="Report Type"
value={selectedDataset?.reportType || "Custom"}
subtitle="AI classified"
icon={<FaTags />}
color="#22c55e"
/>

<KPICard
title="Datasets"
value={`${datasets.length} / 5`}
subtitle="Free tier"
icon={<FaFolderOpen />}
color="#f97316"
/>

</section>

          <section className="dashboard-grid">
            <ChartPanel
              chartData={chartData}
              labelKey={chartLabelKey}
              valueKey={chartValueKey}
            />

            <AISummaryCard
              dataset={selectedDataset}
              onGenerateSummary={handleGenerateSummary}
              generating={generatingSummary}
            />
          </section>

          <DataPreview
            rows={paginatedRows}
            columns={allColumns}
            searchText={searchText}
            onSearchChange={handleSearchChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />

          <RecentUploads
            datasets={datasets}
            onSelect={fetchDatasetById}
            onDelete={handleDeleteDataset}
          />
        </>
      )}
    </main>
  </div>
);
}

export default Dashboard;