const Dataset = require("../models/Dataset");
const { parseUploadedFile } = require("../services/fileParserService");
const { detectReportType } = require("../services/reportDetectionService");
const { generateAISummary } = require("../services/aiService");

const uploadDataset = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an Excel or CSV file");
    }

    const parsedData = await parseUploadedFile(req.file);

 
    const reportType = detectReportType(parsedData.columns);

    const dataset = await Dataset.create({
      user: req.user._id,
      name: req.file.originalname,
      reportType,
      columns: parsedData.columns,
      rows: parsedData.rows,
      rowCount: parsedData.rowCount,
      columnCount: parsedData.columnCount,
      numericColumns: parsedData.numericColumns,
    });

    res.status(201).json({
      success: true,
      message: "Dataset uploaded successfully",
      dataset,
    });
  } catch (error) {
    next(error);
  }
};
const getDatasets = async (req, res, next) => {
  try {
    const datasets = await Dataset.find({ user: req.user._id })
      .select("-rows")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: datasets.length,
      datasets,
    });
  } catch (error) {
    next(error);
  }
};

const generateDatasetSummary = async (req, res, next) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!dataset) {
      res.status(404);
      throw new Error("Dataset not found");
    }

    const summary = await generateAISummary(dataset);

    dataset.aiSummary = summary;
    await dataset.save();

    res.status(200).json({
      success: true,
      message: "AI summary generated successfully",
      aiSummary: summary,
    });
  } catch (error) {
    next(error);
  }
};

const getDatasetById = async (req, res, next) => {
  try{
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      res.status(404);
      throw new Error("Dataset not found");
    }
    res.status(200).json({
      success: true,
      dataset,
    });
  }catch (error) {
    next(error);
  }
};
const exportDatasetCSV = async (req, res, next) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!dataset) {
      res.status(404);
      throw new Error("Dataset not found");
    }

    const headers = dataset.columns.map((column) => column.name);

    const csvRows = dataset.rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${dataset.name}-export.csv"`
    );

    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

const deleteDatasetById = async (req, res, next) => {
  try{
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      res.status(404);
      throw new Error("Dataset not found");
    }

    await dataset.deleteOne();
    res.status(200).json({
      success: true,
      message: "Dataset deleted successfully",
    });
  }
  catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDataset,
  getDatasets,
  getDatasetById,
  deleteDatasetById,
  generateDatasetSummary,
  exportDatasetCSV
};