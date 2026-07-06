/* eslint-disable no-control-regex */
/* eslint-disable no-unsafe-finally */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/axios";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function safeErrorMessage(error, fallbackMessage) {
  if (!error) return fallbackMessage;

  const responseData = error.response?.data;
  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message;
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

async function parseBlobErrorMessage(error, fallbackMessage) {
  const data = error?.response?.data;

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (typeof parsed?.message === "string" && parsed.message.trim()) {
        return parsed.message;
      }
      if (typeof text === "string" && text.trim()) {
        return text;
      }
    } catch {
      // ignore parse errors and fall through
    }
  }

  return safeErrorMessage(error, fallbackMessage);
}

function sanitizeFileName(name = "dataset") {
  return String(name)
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
    .replace(/\s+/g, "-")
    .slice(0, 120) || "dataset";
}

function useDatasets() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  const isMountedRef = useRef(true);
  const latestFetchIdRef = useRef(0);

  const safeSetState = useCallback((setter) => {
    if (isMountedRef.current) {
      setter();
    }
  }, []);

  const fetchDatasets = useCallback(async () => {
    const requestId = ++latestFetchIdRef.current;

    safeSetState(() => {
      setLoadingDatasets(true);
      setError("");
    });

    try {
      const res = await api.get("/datasets");

      // ignore stale responses
      if (!isMountedRef.current || requestId !== latestFetchIdRef.current) return;

      const nextDatasets = Array.isArray(res.data?.datasets) ? res.data.datasets : [];
      setDatasets(nextDatasets);

      // keep selected dataset in sync if it still exists in refreshed list
      setSelectedDataset((prev) => {
        if (!prev?._id) return prev;
        const updatedSelected = nextDatasets.find((d) => d?._id === prev._id);
        return updatedSelected || null;
      });
    } catch (err) {
      if (!isMountedRef.current || requestId !== latestFetchIdRef.current) return;
      setError(safeErrorMessage(err, "Failed to fetch datasets"));
    } finally {
      if (!isMountedRef.current || requestId !== latestFetchIdRef.current) return;
      setLoadingDatasets(false);
    }
  }, [safeSetState]);

  const fetchDatasetById = useCallback(async (id) => {
    if (!id) {
      setError("Dataset ID is required");
      return;
    }

    setError("");

    try {
      const res = await api.get(`/datasets/${id}`);
      if (!isMountedRef.current) return;

      const dataset = res.data?.dataset || null;
      setSelectedDataset(dataset);
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(safeErrorMessage(err, "Failed to fetch dataset"));
    }
  }, []);

  const handleGenerateSummary = useCallback(async (id) => {
    if (!id) {
      setError("Dataset ID is required to generate summary");
      return;
    }

    setGeneratingSummary(true);
    setError("");

    try {
      const res = await api.post(`/datasets/${id}/summary`);
      if (!isMountedRef.current) return;

      const aiSummary = res.data?.aiSummary ?? "";
      setSelectedDataset((prev) => {
        if (!prev) return prev;
        if (prev._id !== id) return prev;
        return {
          ...prev,
          aiSummary,
        };
      });

      // keep list metadata fresh in case backend updates summary-related fields
      await fetchDatasets();
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(safeErrorMessage(err, "Failed to generate summary"));
    } finally {
      if (!isMountedRef.current) return;
      setGeneratingSummary(false);
    }
  }, [fetchDatasets]);

  const handleUpload = useCallback(async (input) => {
    const file = input?.target?.files?.[0] || input;

    if (!file) return;

    // client-side validations
    if (
      file.type &&
      !ALLOWED_MIME_TYPES.includes(file.type) &&
      !/\.(csv|xlsx|xls)$/i.test(file.name || "")
    ) {
      setError("Unsupported file type. Please upload CSV or Excel files.");
      if (input?.target) input.target.value = "";
      return;
    }

    if (typeof file.size === "number" && file.size > MAX_UPLOAD_SIZE_BYTES) {
      setError("File is too large. Maximum allowed size is 10MB.");
      if (input?.target) input.target.value = "";
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/datasets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!isMountedRef.current) return;

      const uploadedDataset = res.data?.dataset || null;
      setSelectedDataset(uploadedDataset);
      await fetchDatasets();
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(safeErrorMessage(err, "Upload failed"));
    } finally {
      if (!isMountedRef.current) return;
      setUploading(false);

      if (input?.target) {
        input.target.value = "";
      }
    }
  }, [fetchDatasets]);

  const handleDeleteDataset = useCallback(async (id) => {
    if (!id) {
      setError("Dataset ID is required to delete dataset");
      return;
    }

    try {
      setError("");
      await api.delete(`/datasets/${id}`);

      if (!isMountedRef.current) return;

      setDatasets((prev) => prev.filter((d) => d?._id !== id));
      setSelectedDataset((prevSelected) =>
        prevSelected?._id === id ? null : prevSelected
      );

      await fetchDatasets();
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(safeErrorMessage(err, "Failed to delete dataset"));
    }
  }, [fetchDatasets]);

  const handleExportCSV = useCallback(async (id, fileName = "dataset") => {
    if (!id) {
      setError("Dataset ID is required to export CSV");
      return;
    }

    try {
      setError("");

      const res = await api.get(`/datasets/${id}/export/csv`, {
        responseType: "blob",
      });

      if (!isMountedRef.current) return;

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFileName(fileName)}-export.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (!isMountedRef.current) return;
      const message = await parseBlobErrorMessage(err, "Failed to export CSV");
      setError(message);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchDatasets();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchDatasets]);

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