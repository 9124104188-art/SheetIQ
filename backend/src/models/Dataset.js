const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    reportType: {
      type: String,
      enum: ["sales", "inventory", "hr", "finance", "students", "custom"],
      default: "custom",
    },

    columns: [
      {
        name:{
          type: String,
          required: true,
        }, 
        type: {
          type: String,
           enum: ["text", "number", "date", "empty"],
          default: "text",
        }
      },
    ],

    rows: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    rowCount: {
      type: Number,
      default: 0,
    },

    columnCount: {
      type: Number,
      default: 0,
    },

    numericColumns: {
      type: [String],
      default: [],
    },

    aiSummary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

datasetSchema.index({ user: 1, createdAt: -1 });

const Dataset = mongoose.model("Dataset", datasetSchema);

module.exports = Dataset;