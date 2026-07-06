const ExcelJS = require("exceljs");
const { Readable } = require("stream");

const normalizeHeader = (header, index) => {
  const cleaned = String(header || `column_${index + 1}`)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");

  return cleaned || `column_${index + 1}`;
};

const makeUniqueHeaders = (headers) => {
  const seen = {};

  return headers.map((header) => {
    if (!seen[header]) {
      seen[header] = 1;
      return header;
    }

    seen[header] += 1;
    return `${header}_${seen[header]}`;
  });
};

const getCellValue = (cell) => {
  const value = cell.value;

  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    if (value.text) return value.text;
    if (value.result !== undefined) return value.result;
    if (value.richText) {
      return value.richText.map((item) => item.text).join("");
    }
  }

  return value;
};

const isEmptyValue = (value) => {
  return value === null || value === undefined || String(value).trim() === "";
};

const removeEmptyRows = (rows) => {
  return rows.filter((row) =>
    Object.values(row).some((value) => !isEmptyValue(value))
  );
};

const removeEmptyColumns = (rows, columns) => {
  const usefulColumns = columns.filter((column) =>
    rows.some((row) => !isEmptyValue(row[column]))
  );

  const cleanedRows = rows.map((row) => {
    const cleanedRow = {};

    usefulColumns.forEach((column) => {
      cleanedRow[column] = row[column];
    });

    return cleanedRow;
  });

  return {
    rows: cleanedRows,
    columns: usefulColumns,
  };
};

const detectColumnType = (values) => {
  const cleanValues = values.filter((value) => !isEmptyValue(value));

  if (cleanValues.length === 0) return "empty";

  const numericCount = cleanValues.filter((value) => {
    return typeof value === "number" || (!isNaN(Number(value)) && value !== "");
  }).length;

  if (numericCount / cleanValues.length >= 0.8) return "number";

  const dateCount = cleanValues.filter((value) => {
    if (value instanceof Date) return true;

    const date = new Date(value);
    return !isNaN(date.getTime()) && isNaN(Number(value));
  }).length;

  if (dateCount / cleanValues.length >= 0.8) return "date";

  return "text";
};

const buildMetadata = (rows, columns) => {
  const typedColumns = columns.map((column) => {
    const values = rows.map((row) => row[column]);

    return {
      name: column,
      type: detectColumnType(values),
    };
  });

  const numericColumns = typedColumns
    .filter((column) => column.type === "number")
    .map((column) => column.name);

  return {
    columns: typedColumns,
    numericColumns,
    rowCount: rows.length,
    columnCount: typedColumns.length,
  };
};

const parseXlsxBuffer = async (fileBuffer) => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error("Excel file does not contain any sheets");
  }

  const rawHeaders = [];

  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    rawHeaders.push(normalizeHeader(getCellValue(cell), colNumber - 1));
  });

  const headers = makeUniqueHeaders(rawHeaders);

  if (headers.length === 0) {
    throw new Error("No headers found in the first row");
  }

  const rows = [];

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber === 1) return;

    const rowData = {};

    headers.forEach((header, index) => {
      const cell = row.getCell(index + 1);
      rowData[header] = getCellValue(cell);
    });

    rows.push(rowData);
  });

  return {
    rows,
    columns: headers,
  };
};

const parseCsvBuffer = async (fileBuffer) => {
  const workbook = new ExcelJS.Workbook();

  const stream = Readable.from(fileBuffer);

  const worksheet = await workbook.csv.read(stream);

  const rawHeaders = [];

  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    rawHeaders.push(normalizeHeader(getCellValue(cell), colNumber - 1));
  });

  const headers = makeUniqueHeaders(rawHeaders);

  if (headers.length === 0) {
    throw new Error("No headers found in the first row");
  }

  const rows = [];

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber === 1) return;

    const rowData = {};

    headers.forEach((header, index) => {
      const cell = row.getCell(index + 1);
      rowData[header] = getCellValue(cell);
    });

    rows.push(rowData);
  });

  return {
    rows,
    columns: headers,
  };
};

const parseUploadedFile = async (file) => {
  const fileName = file.originalname.toLowerCase();

  let parsed;

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    parsed = await parseXlsxBuffer(file.buffer);
  } else if (fileName.endsWith(".csv")) {
    parsed = await parseCsvBuffer(file.buffer);
  } else {
    throw new Error("Unsupported file type. Please upload Excel or CSV");
  }

  let cleanedRows = removeEmptyRows(parsed.rows);

  if (cleanedRows.length === 0) {
    throw new Error("Uploaded file does not contain valid data rows");
  }

  if (cleanedRows.length > 1000) {
    throw new Error("Maximum 1000 rows are allowed in Version 1");
  }

  const cleaned = removeEmptyColumns(cleanedRows, parsed.columns);

  const metadata = buildMetadata(cleaned.rows, cleaned.columns);

  return {
    rows: cleaned.rows,
    columns: metadata.columns,
    rowCount: metadata.rowCount,
    columnCount: metadata.columnCount,
    numericColumns: metadata.numericColumns,
  };
};

module.exports = {
  parseUploadedFile,
};