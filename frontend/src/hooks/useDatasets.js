
import { useEffect, useState } from "react";
import api from "../api/axios";

function useDatasets() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  const fetchDatasetById = async (id) => {
    try {
      const res = await api.get(`/datasets/${id}`);
      setSelectedDataset(res.data.dataset);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch dataset");
    }
  };

  const handleGenerateSummary = async (id) => {
  try {
    setGeneratingSummary(true);
    setError("");

    const res = await api.post(`/datasets/${id}/summary`);

    setSelectedDataset((prev) => ({
      ...prev,
      aiSummary: res.data.aiSummary,
    }));
  } catch (error) {
    setError(error.response?.data?.message || "Failed to generate summary");
  } finally {
    setGeneratingSummary(false);
  }
};

  const fetchDatasets = async () => {
  try {
    setLoadingDatasets(true);
    setError("");

    const res = await api.get("/datasets");
    setDatasets(res.data.datasets);
  } catch (error) {
    setError(error.response?.data?.message || "Failed to fetch datasets");
  } finally {
    setLoadingDatasets(false);
  }
};

 const handleUpload = async (input) => {
  const file = input?.target?.files?.[0] || input;

  if (!file) return;

  try {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/datasets/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setSelectedDataset(res.data.dataset);
    await fetchDatasets();
  } catch (error) {
    setError(error.response?.data?.message || "Upload failed");
  } finally {
    setUploading(false);

    if (input?.target) {
      input.target.value = "";
    }
  }
};

  const handleDeleteDataset = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dataset?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await api.delete(`/datasets/${id}`);

      if (selectedDataset?._id === id) {
        setSelectedDataset(null);
      }

      await fetchDatasets();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete dataset");
    }
  };
  const handleExportCSV = async (id, fileName = "dataset") => {
  try {
    setError("");

    const res = await api.get(`/datasets/${id}/export/csv`, {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}-export.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    setError(error.response?.data?.message || "Failed to export CSV");
  }
};

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDatasets();
  }, []);

 return {
  datasets,
  selectedDataset,
  uploading,
  error,
  loadingDatasets,
  fetchDatasets,
  fetchDatasetById,
  handleUpload,
  handleDeleteDataset,
  generatingSummary,
  handleGenerateSummary,
  handleExportCSV,
};
}

export default useDatasets;