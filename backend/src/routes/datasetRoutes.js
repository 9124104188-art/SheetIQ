const express = require("express");
const router = express.Router();

const {
  uploadDataset,
  getDatasets,
  getDatasetById,
  generateDatasetSummary,
  exportDatasetCSV,
  deleteDatasetById
} = require("../controllers/datasetController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", protect, upload.single("file"), uploadDataset);
router.get("/", protect, getDatasets);
router.get("/:id", protect, getDatasetById);
router.delete("/:id", protect, deleteDatasetById);
router.post("/:id/summary", protect, generateDatasetSummary);
router.get("/:id/export/csv", protect, exportDatasetCSV);

module.exports = router;